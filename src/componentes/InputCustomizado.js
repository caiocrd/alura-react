import React, {Component} from 'react';
import PubSub from 'pubsub-js'

export default class InputCustomizado extends Component{
    constructor(){
        super();
        this.state = {mensagemErro:""};
        PubSub.subscribe('erros', function(flag, erros){
            //console.log(erros);
            erros.responseJSON.errors.forEach(erro => {
                if(erro.field === this.props.name){
                    this.setState({mensagemErro:erro.defaultMessage});
                }
            });
            
        }.bind(this));
        PubSub.subscribe('limpa-erros', function(flag){
            this.setState({mensagemErro:""});
        }.bind(this))
    }
    render(){
        return(
            <div className="pure-control-group">
            <label htmlFor={this.props.id}>{this.props.label}</label> 
            <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value}  onChange={this.props.onChange}/>   
            <span>{this.state.mensagemErro}</span>               
          </div>  
        )
    }

}