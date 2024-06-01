import React from 'react'

export default function Chip({ text, color}) {
    return (
        <div>
            <span className="badge badge-pill m-1" style={{border: `solid 1px ${color}`, color: color}}>{text}</span>
        </div>
    )
}
