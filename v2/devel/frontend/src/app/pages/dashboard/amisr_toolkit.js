//////////////////////////////////////////////////////////////////////////
//
//  Data representation of an AMISR phased array.
//
//  16 cols, 8 rows
//
//  https://gist.github.com/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
//
//  2023-11-21  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

const make_array = ({rows, cols}) => {
    
    let data = [] 
    let xpos = 1
    let ypos = 1
    let width = 50
    let height = 100

    for (let row=0; row<rows; row++) {
        data.push([])

        for (let col=0; col<cols; col++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height
            })
            xpos += width
        }
        xpos = 1
        ypos += height
    }

    return data
}

export default {
    make_array
}
