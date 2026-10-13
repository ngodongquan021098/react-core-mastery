import { useEffect, useRef, useState } from "react"

export const UseRefLab = () => {
    const [seconds, setSeconds] = useState<number>(0)

    const timerId = useRef<number>(0)

    const inputRef = useRef<HTMLInputElement>(null)

    const renderCountRef = useRef<number>(0)

    const paragraphRef = useRef<HTMLParagraphElement>(null)

    const wasRunningRef = useRef<boolean>(false);

    const handleClickStart = () => {
        if (timerId.current) {
            return
        }

        timerId.current = setInterval(() => {
            setSeconds((second) => second + 1)
        }, 1000)
    }

    const handleClickEnd = () => {
        clearInterval(timerId.current)
        timerId.current = 0
    }

    const handleReset = () => {
        setSeconds(0)
        handleClickEnd()
        inputRef.current?.focus()
    }

    useEffect(() => {
        renderCountRef.current += 1
        if (paragraphRef.current) {
            paragraphRef.current.textContent = renderCountRef.current.toString()
        }
    })

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (timerId.current) {
                    wasRunningRef.current = true
                    handleClickEnd()
                }
            } else {
                if (wasRunningRef.current) {
                    handleClickStart()
                    wasRunningRef.current = false
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            clearInterval(timerId.current)
        };
    }, [])

    return <div>
        <input ref={inputRef} placeholder="Ghi chú vòng chạy..."></input>
        <button onClick={handleClickStart}>Start</button>
        <button onClick={handleClickEnd}>Stop</button>
        <button onClick={handleReset}>Reset</button>
        {seconds}
        <p ref={paragraphRef}></p>
    </div>
}