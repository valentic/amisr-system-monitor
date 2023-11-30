import React from 'react'
import { 
    Stage,
    Layer,
    Rect,
    Circle
} from 'react-konva'

const Canvas = () => {
    return (
        <Stage width={300} height={150}>
          <Layer>
            <Rect x={20} y={20} width={50} height={75} fill="blue" draggable />
            <Circle x={50} y={40} radius={30} fill="red" draggable />
          </Layer>
        </Stage>
    )
}

export default Canvas
