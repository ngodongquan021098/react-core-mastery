import { useEffect, useState } from "react"

export const UseEffectLab = () => {
  const [userId, setUserId] = useState<number>(0)

  const [userData, setUserData] = useState(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handleFakeApi = (timer: number, data: any, signal?: AbortSignal) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true)
      const timerId = setTimeout(() => {
        resolve(data)
        setIsLoading(false)
      }, timer)

      // 💡 Lắng nghe tín hiệu hủy từ AbortController:
      signal?.addEventListener('abort', () => {
        clearTimeout(timerId)
        reject(new DOMException('Aborted', 'AbortError')); // Ném ra AbortError chuẩn
        setIsLoading(false)
      })
    })
  }

  const handleGetDataFirstUser = async (signal?: AbortSignal): Promise<any> => {
    return await handleFakeApi(3000, { id: 1, name: "Alice (User 1 - Chậm)" }, signal)
  }
  const handleGetDataSecondUser = async (signal?: AbortSignal): Promise<any> => {
    return await handleFakeApi(800, { id: 2, name: "Bob (User 2 - Nhanh)" }, signal)
  }

  // handle destroy fetch api with primitive value
  // useEffect(() => {
  //   let ignore = false

  //   if (userId === 1) {
  //     handleGetDataFirstUser().then((result) => {
  //       console.log({ ignore1: ignore })

  //       if (!ignore) {
  //         console.log({ ignore1: ignore })
  //         setUserData(result)
  //       }
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  //   } else if (userId === 2) {
  //     handleGetDataSecondUser().then((result) => {
  //       console.log({ ignore2: ignore })

  //       if (!ignore) {
  //         setUserData(result)
  //       }
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  //   }

  //   return () => {
  //     console.log('set ignore')
  //     ignore = true
  //   }
  // }, [userId]);

  // handle destroy fetch api with AbortController
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    if (userId === 1) {
      handleGetDataFirstUser(signal).then((result) => {
        setUserData(result)
      }).catch((error) => {
        if (error.name === 'AbortError') {
          console.log("Đã hủy request 1 thành công!")
        }
      })
    } else if (userId === 2) {
      handleGetDataSecondUser(signal).then((result) => {
        setUserData(result)
      }).catch((error) => {
        if (error.name === 'AbortError') {
          console.log("Đã hủy request 2 thành công!")
        }
      })
    }
    return () => {
      controller.abort()
    }
  }, [userId])

  return (
    <div>
      {isLoading && <p>Loading ...</p>}
      <p>{JSON.stringify(userData)}</p>
      <button onClick={() => setUserId(1)}>user 1</button>
      <button onClick={() => setUserId(2)}>user 2</button>
    </div >
  )
}