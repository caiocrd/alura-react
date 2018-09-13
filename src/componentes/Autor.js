import React, {Component} from 'react';
import InputCustomizado from './InputCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js'

export default class AutorBox extends Component{
    render(){
        return(
            <div>
                <FormularioAutor/>
                <ListaAutor/>
            </div>
        );
    };
}

export class ListaAutor extends Component{

    constructor(){
        super();
        this.state = {lista:[]};
    }

    componentDidMount(){
        console.log("willMount");
        $.ajax({
            url:"http://cdc-react.herokuapp.com/api/autores",
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
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                     
                      this.state.lista.map(autor => {
                        return(
                          <tr key={autor.id}>
                            <td>{autor.nome}</td>
                            <td>{autor.email}</td>
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

export class FormularioAutor extends Component{

    constructor(){
        super();
        this.limpaForm();
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
        
    }
    limpaForm(){
        this.state = { nome:"", email:"", senha:""};
    }
    enviaForm(evento){
        console.log("irro");
        evento.preventDefault();
        PubSub.publish('limpa-erros');
        $.ajax({
            url:"http://cdc-react.herokuapp.com/api/autores",
            type:'post',
            dataType: 'json',
            contentType:"application/json",
            data:JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha}),
            success: (resposta => {
                PubSub.publish('atualiza-lista', resposta);
                this.state = { nome:"", email:"", senha:""};
            }).bind(this),
            error: (resposta =>
                PubSub.publish('erros', resposta)
            )
        });
    }
    
    setNome(evento){
    this.setState({nome:evento.target.value});
    }
    
    setEmail(evento){
    this.setState({email:evento.target.value});
    }
    
    setSenha(evento){
    this.setState({senha:evento.target.value});
    }
    

    render(){
        return(
        <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">

                  <InputCustomizado id="nome" label="Nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}/>                    
                    
                  <InputCustomizado label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail}/>                  
                   
                  <InputCustomizado label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} /> 
                 
                  <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                  </div>
                </form>             

              </div> 
        )
    }
}