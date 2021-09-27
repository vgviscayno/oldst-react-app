import { useEffect, useReducer, useCallback, useState, useRef } from 'react'
import { ProductListItem } from './ProductListItem'

function ProductList() {
    const productListReducer = (state, action) => {
        switch (action.type) {
        case 'RESET_PRODUCTS':
            return {...state, products:[]}
        case 'STACK_PRODUCTS':
            return { ...state, products: state.products.concat(action.products) }
        case 'FETCHING_PRODUCTS':
            return { ...state, fetching: action.fetching }
        default:
            return state;
        }
    }
    
    const pageReducer = (state, action) => {
        switch (action.type) {
        case 'ADVANCE_PAGE':
            return {...state, page: state.page + 1}
        default:
            return state;
        }
    }
    
    const [productListData, productListDispatch] = useReducer(productListReducer, {products:[], fetching: true})
    const [pager, pagerDispatch] = useReducer(pageReducer, {page: 0})
    const [sortBy, setSortBy] = useState('size')
    
    useEffect(() => {
        productListDispatch({type:'FETCHING_PRODUCTS', fetching: true})
        fetch(`http://localhost:8000/products?_sort=${sortBy}&_page=${pager.page}&_limit=10`)
        .then(response => response.json())
        .then(products => {
            if(pager.page > 0 && ((pager.page) % 2 === 0)){
                console.log('page w/ad: ' + pager.page)
                products = [{adImg: `http://localhost:8000/ads/?r=${Math.floor(Math.random()*1000)}`}, ...products]
            }
            productListDispatch({type:'STACK_PRODUCTS', products})
            productListDispatch({type:'FETCHING_PRODUCTS', fetching: false})
        })
        .catch(error => console.log(error))
    }, [productListDispatch, pager.page, sortBy]);
    
    let bottomBoundaryRef = useRef(null);
    const scrollObserver = useCallback(
        node => {
        new IntersectionObserver(entries => {
            entries.forEach(en => {
            if (en.intersectionRatio > 0 && pager.page < 49) {
                pagerDispatch({type: 'ADVANCE_PAGE'})
            }
            });
        }).observe(node)
        },
        [pagerDispatch]
    );
    useEffect(() => {
        if(bottomBoundaryRef.current){
        scrollObserver(bottomBoundaryRef.current)
        }
    }, [scrollObserver, bottomBoundaryRef])
    
    const onSortChange = (e) => {
        setSortBy(e.target.value)
        productListDispatch({type: 'RESET_PRODUCTS'})
    }
    return (
        <div>
            <div className="container p-4">
                <p>Sort products by: </p>
                <select className="form=select" onChange={e => onSortChange(e)}>
                <option value="size">Size</option>
                <option value="price">Price</option>
                <option value="date">Date</option>
                </select>
            </div>
            <div className="container px-4">
                <div className="row row-cols-1 row-cols-2 row-cols-4 g-5">
                {productListData.products.map((product, index) => {
                    return <ProductListItem key={index} index={index} {...product} />
                })}
                </div>
            </div>
            {productListData.fetching && (
            <div className="text-center bg-secondary m-auto p-3">
            <p className="m-0 text-white">loading...</p>
            </div>
            )}
            {(productListData.products.length >= 500 && !productListData.fetching) && (
            <div className="text-center bg-success m-auto p-3">
            <p className="m-0 text-white">~ end of catalogue ~</p>
            </div>
            )} 
            <div id='page-bottom-boundary' style={{ border: '1px solid red' }} ref={bottomBoundaryRef}></div>
        </div>
    )
}

export default ProductList;