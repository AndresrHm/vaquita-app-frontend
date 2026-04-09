import { useEffect, type DependencyList } from 'react'

export const useOnInit = (initialCallBack: () => void, deps?: DependencyList) => {
    useEffect(() => {
        initialCallBack()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps || [])
}
