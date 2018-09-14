import React, {Component} from 'react';
import InputCustomizado from './InputCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js'

export default class LivroBox extends Component{
    render(){
        return(
            <div>
            <div className="header">
                <h1>Cadastro de Livros</h1>
            </div>
            <div className="content" id="content">
                <FormularioLivro/>
                <ListaLivro/>         
            </div>
            
                
            </div>
        );
    };
}

export class ListaLivro extends Component{

    constructor(){
        super();
        this.state = {lista:[]};
    }

    componentDidMount(){
        console.log("willMount");
        $.ajax({
            url:"http://cdc-react.herokuapp.com/api/livros",
            dataType: 'json',
            success:function(resposta){
              this.setState({lista:resposta});
              }.bind(this)
        });
        PubSub.subscribe('atualiza-lista', function(topico, novaLista){
            this.setState({lista:novaLista});
        }.bind(this));
      }

    render(){
        return(
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Preço</th>
                      <th>Autor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                     
                      this.state.lista.map(livro => {
                        return(
                          <tr key={livro.id}>
                            <td>{livro.titulo}</td>
                            <td>{livro.preco}</td>
                            <td>{livro.autor.nome}</td>
                          </tr>
                        );
                      })
                    }
                  
                  </tbody>
                </table> 
              </div> 

        );
    }
}

export class FormularioLivro extends Component{

    constructor(){
        super();
        this.limpaForm();
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
        
    }

    componentDidMount(){
        console.log("willMount");
        $.ajax({
            url:"http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success:function(resposta){
              this.setState({autores:resposta});
              }.bind(this)
        });
        
      }

    limpaForm(){
        this.state = {autores:[], titulo:"", preco:"", autorId:""};
    }
    enviaForm(evento){
        
        evento.preventDefault();
        PubSub.publish('limpa-erros');
        $.ajax({
            url:"http://cdc-react.herokuapp.com/api/livros",
            type:'post',
            dataType: 'json',
            contentType:"application/json",
            data:JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId}),
            success: (resposta => {
                PubSub.publish('atualiza-lista', resposta);
                this.setState ({ titulo:"", preco:"", autorId:0});
            }).bind(this),
            error: (resposta =>{
                console.log(resposta);
                PubSub.publish('erros', resposta)}
            )
        });
    }
    
    setTitulo(evento){
    this.setState({titulo:evento.target.value});
    }
    
    setPreco(evento){
    this.setState({preco:evento.target.value});
    }
    
    setAutorId(evento){
    this.setState({autorId:evento.target.value});
    }
    

    render(){
        return(
        <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">

                  <InputCustomizado id="titulo" label="Titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo}/>                    
                    
                  <InputCustomizado label="Preço" id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco}/>                  
                   
                  <select value={ this.state.autorId } name="autorId" onChange={ this.setAutorId }>
                    <option value="">Selecione</option>
                    { 
                        this.state.autores.map(function(autor) {
                        return <option key={ autor.id } value={ autor.id }>
                                    { autor.nome }
                                </option>;
                        })
                    }
                </select>
                  
                 
                  <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                  </div>
                </form>             

              </div> 
        )
    }
}