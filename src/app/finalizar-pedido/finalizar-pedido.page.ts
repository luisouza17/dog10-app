import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import Endereco from '../domain/Endereco';

@Component({
  selector: 'app-finalizar-pedido',
  templateUrl: './finalizar-pedido.page.html',
  styleUrls: ['./finalizar-pedido.page.scss'],
})
export class FinalizarPedidoPage implements OnInit {

  constructor(private Alert:AlertController,private nav:NavController) { }

  ngOnInit() {
  }

  buscar(cep) {
    const cepString = cep.el.value
    if(cepString === '' || cepString.length !== 8 || !cepString.match(/^\d+$/g)) {
      console.log("CEP inválido");
    }else {
      console.log("CEP válido")
      let retorno = fetch('https://viacep.com.br/ws/' + cepString + '/json')
      console.log("Enviando requisição...")
      retorno.then(dados => {
        return dados.json()
      }).then(endereco => {
        if(endereco.erro) {
          console.error("CEP Inexistente")
        }else {
          this.Alert.create({
            header: "Seu endereço está correto:",
            subHeader: `${endereco.logradouro} , ${endereco.bairro},${endereco.localidade} - ${endereco.uf.toUpperCase()}`,
            buttons:[{
              text:'Não'
            },{
                text:'Sim',
                handler:() =>{
                  this.Alert.dismiss()
                  this.Alert.create({
                    header:"Qual o seu número?",
                    inputs:[{
                      name:"Numero",
                      type:"number"
                    }],
                    buttons:[{
                      text:'Cancelar',
                    },{
                      text:'Salvar',
                      handler: (dados)=>{
                        let tempend = new Endereco()
                        tempend.bairro= endereco.bairro;
                        tempend.cidade=endereco.localidade;
                        tempend.estado=endereco.uf;
                        tempend.numero= dados.numero;
                        tempend.rua=endereco.logradouro;
                        tempend.cep = endereco.cep;
                        tempend.salvar()
                        this.nav.back()
                      }
                    }]
                  }).then(alert=>{
                    alert.present();
                  })
                }
              }
          ]
          }).then(alert => {
            alert.present()
          })
        }
      })
    }
  }

}