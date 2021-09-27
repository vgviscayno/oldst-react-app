import numeral from "numeral"
import moment from "moment"

export function ProductListItem ({index, size, face, price, date, adImg}) {
    if(index !== 0 && adImg){
        return (
            <div className="col">
                <div className='card h-100'>
                    <p className='card-header'>But first, a word from our sponsors:</p>
                    <img
                        className='ad'
                        src={adImg}
                        alt='ad'/> 
                </div>
            </div>
        )
    }
    if(!adImg){
        return (
            <div className="col">
                <div className='card h-100'>
                    <div className="card-header h-100">
                        <h5 className='text-center' style={{fontSize: `${size}px`}}>{face}</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item text-center">{numeral(price).format('$0,0.00')}</li>
                        <li className="list-group-item text-center">Size: {size}</li>
                        <li className="list-group-item text-center">{moment(date).fromNow()} ({moment(date).format('MMMM DD')})</li>
                    </ul>
                </div>
            </div>
        )
    }
    return null;
}