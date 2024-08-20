import React from 'react'
import LazyLoad from 'react-lazy-load'

const LazyCard = () => {
    return (
        <div className="book-list-item">
            
        </div>
    )
}

export default function Card({ book, isMainList = false }) {
    const dispatch = useDispatch();
    const loadNext = () => {
        if (!isMainList)
            return;
        dispatch(getNextBooks());
    }
    return (
        <LazyLoad elementType='div' height={340} width={250} threshold={0.25} onContentVisible={loadNext}>
            <LazyCard/>
        </LazyLoad>
    )
}
