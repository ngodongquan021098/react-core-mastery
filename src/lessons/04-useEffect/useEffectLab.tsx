import { useEffect, useRef, useState } from "react"

export const UseEffectLab = () => {
    const [userId, setUserId] = useState<number>(0)

    const [userData, setUserData] = useState(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)


    const handleFakeApi = (timer: number, data: any) => {
        return new Promise((resolve, reject) => {
            setIsLoading(true)
            setTimeout(() => {
                try {
                    resolve(data)
                    setIsLoading(false)
                } catch (error) {
                    reject(error)
                    setIsLoading(false)
                }
            }, timer)
        })
    }

    const handleGetDataFirstUser = async (): Promise<any> => {
        return await handleFakeApi(3000, { id: 1, name: "Alice (User 1 - Chậm)" })
    }
    const handleGetDataSecondUser = async (): Promise<any> => {
        return await handleFakeApi(800, { id: 2, name: "Bob (User 2 - Nhanh)" })
    }

    useEffect(() => {
        let ignore = false

        if (userId === 1) {
            handleGetDataFirstUser().then((result) => {
                console.log({ ignore1: ignore })

                if (!ignore) {
                    console.log({ ignore1: ignore })
                    setUserData(result)
                }
            })
        } else if (userId === 2) {
            handleGetDataSecondUser().then((result) => {
                console.log({ ignore2: ignore })

                if (!ignore) {
                    setUserData(result)
                }
            })
        }

        return () => {
            console.log('set ignore')
            ignore = true
        }
    }, [userId]);

    return (
        <div>
            {isLoading && <p>Loading ...</p>}
            <p>{JSON.stringify(userData)}</p>
            <button onClick={() => setUserId(1)}>user 1</button>
            <button onClick={() => setUserId(2)}>user 2</button>
        </div >
    )
}