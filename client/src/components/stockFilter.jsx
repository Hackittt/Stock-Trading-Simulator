import React, { Component } from 'react';

class StockFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minVolume : '',
            maxVolume : '',
            minPrice : '',
            maxPrice : '',
            minAmplitude : '',
            maxAmplitude : '',
            filter : props.filter
        };
    }

    handleMinVolumeChange = (event) => {
        this.setState({ minVolume: event.target.value });
    };

    handleMaxVolumeChange = (event) => {
        this.setState({ maxVolume: event.target.value });
    };

    handleMinPriceChange = (event) => {
        this.setState({ minPrice: event.target.value });
    };

    handleMaxPriceChange = (event) => {
        this.setState({ maxPrice: event.target.value });
    };

    handleMinAmplitudeChange = (event) => {
        this.setState({ minAmplitude: event.target.value });
    };

    handleMaxAmplitudeChange = (event) => {
        this.setState({ maxAmplitude: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.state.filter(this.state.minVolume, this.state.maxVolume, this.state.minPrice, this.state.maxPrice, this.state.minAmplitude, this.state.maxAmplitude);
        // 清空输入框的值
        this.setState({ minVolume: '', maxVolume: '', minPrice: '', maxPrice: '', minAmplitude: '', maxAmplitude: '' });
    };

    render() { 

        return (
            <div>
                <h1>筛选器</h1>
                <form onSubmit={this.handleSubmit}>
                <label htmlFor="minVolume">最小成交量:</label>
                <input
                    className='form-control'
                    type="number"
                    id="minVolume"
                    name="minVolume"
                    min="0"
                    value={this.state.minVolume}
                    onChange={this.handleMinVolumeChange}
                />
                <br />
                <label htmlFor="maxVolume">最大成交量:</label>
                <input
                    className='form-control'
                    type="number"
                    id="maxVolume"
                    name="maxVolume"
                    min="0"
                    value={this.state.maxVolume}
                    onChange={this.handleMaxVolumeChange}
                />
                <br />
                <label htmlFor="minPrice">最低价格:</label>
                <input  
                    className='form-control'
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    min="0"
                    value={this.state.minPrice}
                    onChange={this.handleMinPriceChange}
                />
                <br />
                <label htmlFor="maxPrice">最高价格:</label>
                <input
                    className='form-control'
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    min="0"
                    value={this.state.maxPrice}
                    onChange={this.handleMaxPriceChange}
                />
                <br />
                <label htmlFor="minAmplitude">最低振幅:</label>
                <input
                    className='form-control'
                    type="number"
                    id="minAmplitude"
                    name="minAmplitude"
                    min="0"
                    value={this.state.minAmplitude}
                    onChange={this.handleMinAmplitudeChange}
                />
                <br />
                <label htmlFor="maxAmplitude">最高振幅:</label>
                <input
                    className='form-control'
                    type="number"
                    id="maxAmplitude"
                    name="maxAmplitude"
                    min="0"
                    value={this.state.maxAmplitude}
                    onChange={this.handleMaxAmplitudeChange}
                />
                <br /><br />
                <input type="submit" value="筛选" className='btn btn-primary' />
                <h2>{this.state.minVolume}</h2>
                
                </form>
            </div>
        );
    }
}
 
export default StockFilter;