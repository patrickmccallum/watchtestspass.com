import React, { useState, useEffect, useRef } from "react"
import moment from "moment"

export const Timer = () => {
    const timeRef = useRef(0)
    const [timePassed, setTimePassed] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimePassed(++timeRef.current)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return <span>
        {moment.utc(timePassed*1000).format('s[s]')}
    </span>
}
