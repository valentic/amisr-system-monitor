import React from 'react'

export const SocketContext = React.createContext()

export const useSocket = () => React.useContext(SocketContext)

