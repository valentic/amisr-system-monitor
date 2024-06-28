import React from 'react'
import { io } from 'socket.io-client'
import { SocketContext } from './socket.context'
import { useQueryClient } from '@tanstack/react-query'

const SOCKET_URL = window.location.origin + import.meta.env.VITE_SOCKETIO_URL

export const SocketProvider = ({children}) => {

    const [isConnected, setConnected] = React.useState(false)

    const socket = React.useRef(null)
    const queryClient = useQueryClient()

    const handleOnMessage = message => {
        if (message.type === "WEBSOCKET_DATABASE_EVENT") {
            queryClient.invalidateQueries({ queryKey: [message.payload.table_name] }) 
        } else if (message.type === "WEBSOCKET_DATABASE_DESCRIPTORS") {
            queryClient.setQueryData(["descriptors"], message.payload)
        } else if (message.type === "WEBSOCKET_HEARTBEAT_EVENT") {  
            queryClient.setQueryData(["heartbeat"], Date.now()) 
        }

        console.debug(message)
    }

    const flushData = () => {
        queryClient.invalidateQueries({ queryKey: ['array_data'] }) 
        queryClient.invalidateQueries({ queryKey: ['pmcu_data'] }) 
    }

    React.useEffect(() => {

        if (!isConnected) {
            socket.current = io(window.location.origin, { 
                path: import.meta.env.VITE_SOCKETIO_URL
            })

            socket.current.on('connect', () => {
                console.debug(`Connected to socket at ${SOCKET_URL}`)
                socket.current.emit("join", {"room": "heartbeat"})
                socket.current.emit("join", {"room": "database"})
                setConnected(true)
                queryClient.setQueryData(["socket"], true) 
                flushData()
            })

            socket.current.on('disconnect', () => {
                console.debug('Disconnected socket')
                setConnected(false)
                queryClient.setQueryData(["socket"], false) 
            })

            socket.current.on('error', err => {
                console.debug('Socket error:', err.message)
                setConnected(false)
                queryClient.setQueryData(["socket"], false) 
            })

            socket.current.on('action', handleOnMessage)
        }

        return () => {
            if (socket.current?.connected) {
                socket.current.disconnect()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <SocketContext.Provider value={socket.current}>
          { children }
        </SocketContext.Provider>
    )
}

