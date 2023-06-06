//COMANDO PARA "OUVIR" QUANDO O DISPOSITIVO ESTÁ PRONTO
document.addEventListener('deviceready', onDeviceReady.bind(this), false);

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Framework7 v.3',
    // App id
    id: 'br.com.meuapp',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/index/',
            url: 'index.html',
            on: {
                pageInit: function (event, page) {
					
					//DESATIVAR PAINEL ESQUERDO NA ABERTURA
                    app.panel.disableSwipe('left');
					
                    //REMOVER ANIMACAO DE "CORACAO BATENDO" 2 SEGUNDOS
                    setTimeout(function () {
                        $(".Aligner").removeClass("animated lightSpeedIn");
                    }, 2000);
					
					//ANIMAÇÃO DE BATER CORACAO 2 SEGUNDOS E MEIO
					setTimeout(function () {
                        $(".Aligner").addClass("animated heartBeat");
                    }, 2500);

					//REMOVER ANIMACAO DE "CORACAO BATENDO" 3 SEGUNDOS E MEIO
					setTimeout(function () {
                        $(".Aligner").removeClass("animated heartBeat");
                    }, 3500);
					
                    //FAZER NOVAMENTE ANIMACAO DO CORACAO BATENDO 4 SEGUNDOS E MEIO
                    setTimeout(function () {
                        $(".Aligner").addClass("animated lightSpeedOut");
                    }, 4500);


                    //REDIRECIONAR PARA HOME EM 5 SEGUNDOS
                    setTimeout(function () {
						
                        app.views.main.router.navigate('/home/');
                    	
                    }, 5500);
					
					

                    }
               }
        },
		{
            path: '/home/',
            url: 'home.html',
            on: {
                pageInit: function (event, page) {
					
				setTimeout(function(){ 
				
				app.dialog.alert('<img src="img/swipe-left.gif" style="max-width:100%">','');

				}, 500);
				
				$("#queroCadastrar").on("click", function(){
					 app.views.main.router.navigate('/cadastrar/');
				});
		
				}	
               }
        },	
{
            path: '/cadastrar/',
            url: 'cadastrar.html',
            on: {
                pageInit: function (event, page) {
				
					$('#CadtelefoneCadastro').mask('(00) 00000-0009');
					$('#CadcpfCadastro').mask('000.000.000-00');
					
					$('#Cadcadastra').click(function () {
					 
						var nome = $$("#CadnomeCadastro").val();
                        var email = $$("#CademailCadastro").val();
                        var senha = $$("#CadsenhaCadastro").val();
						var RepeteSenha = $$("#CadrepeteSenhaCadastro").val();
						var telefone = $$("#CadtelefoneCadastro").val();
						var CPF = $$("#CadcpfCadastro").val();
						var dataNascimento = $$("#CaddatanascimentoCadastro").val();	
                    
                        if ((nome == '') || (email == '') || (senha == '') || (telefone =='')|| (CPF =='')|| (RepeteSenha =='')|| (dataNascimento =='')) {
                               app.dialog.alert('Por favor, todos os campos sao obrigatorios.', '<i class="mdi mdi-alert"></i> Campos faltando!');
                                return false;                            
                        }

                        if ((nome !== '') && (email !== '') && (senha !== '')&& (telefone !== '')&& (CPF !== '')&& (RepeteSenha !== '')&& (dataNascimento !== '')) {

                            //VALIDACAO DO EMAIL
                            var sEmail = email;
                            // filtros
                            var emailFilter = /^.+@.+\..{2,}$/;
                            var illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]]/
                            // condicao
                            if (!(emailFilter.test(sEmail)) || sEmail.match(illegalChars)) {
                                //EMAIL INVALIDO
                                app.dialog.alert('Por favor, informe um e-mail valido!', '<i class="mdi mdi-alert"></i> E-mail Invalido');
                                    return false;
                                                             
                            } else {								
								//VERIFICAR SE AS SENHAS SAO IGUAIS
								if (senha==RepeteSenha){
									//SENHAS SAO IGUAIS - VERIFICAR O CHECKBOX
									//EMAIL E VALIDO
                                 if(($("#CadcheckPolitica").is(":checked"))&&($("#CadcheckTermos").is(":checked"))){
									//TA TUDO OK
								//TUDO OK
                                    //AJAX PARA CADASTRAR
									app.dialog.preloader('Cadastrando');                          
                              
                                $.ajax({
                                    type: 'POST',
                                    data: { nome: nome, email: email, senha: senha, telefone: telefone,CPF:CPF,datanascimento:dataNascimento,valida:'ok'},
                                    url: 'https://genialcursos.com.br/app/cadastra.php',
                                    crossDomain: true,

                                    success: function (resposta) {

                                        if (resposta == 0) {
                                            app.dialog.close();

                                                app.dialog.alert('Tudo certo. Um email foi enviado para endere&ccedil;o cadastrado. Caso esque&ccedil;a a senha verifique este email.', '<i class="mdi mdi-email-check-outline"></i> <b>Cadastrado!</b>', function () {
                                                    //ARMAZENA CADA ITEM DO USUARIO EM UM LOCALSTORAGE
                                                    localStorage.setItem("nome", nome);
                                                    localStorage.setItem("login", email);
                                                    localStorage.setItem("senha", senha);
													localStorage.setItem("telefone", telefone);
													localStorage.setItem("CPF", CPF);
													localStorage.setItem("DataNascimento", dataNascimento);
													
													app.views.main.router.navigate('/destino/');
                                                });
                           
                                           

                                        }

                                        if (resposta == 1) {
                                            app.dialog.close();
                                           app.dialog.alert('Por favor tente novamente!', 'Falhou...');                                   
                                            
                                        }

                                        if (resposta == 3) {
                                            app.dialog.close();

                                                app.dialog.alert('Por favor, informe outro email!', '<i class="mdi mdi-email-lock"></i> <b>Email j&aacute; Cadastrado</b>');
                                                                                       
                                          

                                        }

                         

                                    },

                                    error: function (erro) {
                                        app.dialog.close();
                                     
                                       app.dialog.alert('Falha em se comunicar com servidor. Por favor, tente novamente!');
                                                                               
                                    }

                                });
								
								
								
								}else{
								app.dialog.alert("É preciso aceitar as <b>Políticas de Privacidade</b> e também os <b>Termos de Uso</b> para se cadastrar.","<i class='mdi mdi-alert'></i> Aceitar Termos");  
								}
									
									
								}else{
								  app.dialog.alert('A senha e a repetição da senha não são iguais!', '<i class="mdi mdi-alert"></i> Senha e Repetição de Senha');
                                    return false;	
								}
								
								
                                							 
                                    
                            }


                        }
					 
					 						
				 });

                    }
               }
        },	
		{
            path: '/login/',
            url: 'login.html',
            on: {
                pageInit: function (event, page) {
				
						$('#Fazerlogin').on('click', function () {
                       
                        var email = $("#ContaLogin").val();
                        var senha = $("#ContaSenha").val();

                        if ((email == '') || (senha == '')) {
                         app.dialog.alert('Por favor, preencha seu email e senha.', '<i class="mdi mdi-alert"></i> Campos Vazios');                        
                           
                        }else{
                           
							app.dialog.preloader('Fazendo Login'); 
                                                      
                            $.ajax({
                                type: 'POST',
                                data: { email: email, senha: senha, chave:'123'},
                                url: 'https://genialcursos.com.br/app/login.php',
                                crossDomain: true,

                                success: function (respost) {

                                    if (respost == 0) {
                                        app.dialog.close();

                                            app.dialog.alert('Nenhum usuário encontrado com este login / senha. Tente novamente!', '<i class="mdi mdi-alert-circle"></i> <b>Login Inválido</b>');
                                            return false;
                                   
                                    }

                                    if (respost !== 0) {
                                        app.dialog.close();
                                        
                                        //DESENCAPSULA OS DADOS DA RESPOSTA
                                        var dados = JSON.parse(respost);

                                        //ARMAZENA CADA ITEM DO USUARIO EM UM LOCALSTORAGE
                                        localStorage.setItem("nome", dados.nome);
                                        localStorage.setItem("login", dados.email);
                                        localStorage.setItem("senha", dados.senha);
										localStorage.setItem("telefone", dados.telefone);
										localStorage.setItem("CPF", dados.cpf);
                                        										                                     
                                      //REDIRECIONA PARA PAGINA PRINCIPAL
                                       app.views.main.router.navigate('/destino/');
                                      
                                    }

                                    

                                },

                                error: function (erro) {
                                    app.dialog.close();
                                 
                                        app.dialog.alert('Falha em se comunicar com servidor. Por favor, tente novamente!');
                                   
                                    
                                   
                                }

                            });
                        }

                        
                    });
					
					$('#esqueceuSenha').on('click', function () {
						app.dialog.prompt('Informe o e-mail de login','<b>SEU EMAIL DE LOGIN</b>', function (email) {
									
					var email=email;
					
					app.dialog.preloader('Verificando');
					
					$.ajax({
						type: 'POST', 
						data: {email:email,chave:'123'}, 
						url: 'https://genialcursos.com.br/app/verificar-email.php',  
							 
						success: function (resposta) {
							
							
							if (resposta==0){
							app.dialog.close();
								app.dialog.prompt('Você recebeu <b><u>no seu email</u></b> um código de verificação para autorizar a criação de uma nova senha. <b>Por favor, informe o código recebido no email</b>:','<b>CÓDIGO DE VERIFICAÇÃO</b>', function (codigo) {
									localStorage.setItem('emailValido',email);
									validaCodigo(codigo);
								});
							
							}
							
							if (resposta==1){
								app.dialog.close();
								app.dialog.alert('Por favor, informe um email válido!','<b>E-MAIL NÃO ENCONTRADO</b>');
							}
							
							if (resposta==2){
								app.dialog.close();
								app.dialog.alert('Houve um problema. Tente novamente','<b>OPS!</b>');
							}
							
						},
							
						error: function (erro) {
							app.dialog.close();
							app.dialog.alert('Não foi possivel se conectar ao servidor');								   
						},
												
						});
					
					
				  });
					});
					
					function validaCodigo(codigo){
						
						app.dialog.close();
						app.dialog.preloader('Verificando');
						
						var email=localStorage.getItem('emailValido');
						
						$.ajax({
						type: 'POST', 
						data: {email:email,codigo:codigo,chave:'123'}, 
						url: 'https://genialcursos.com.br/app/verificar-codigo.php',  
							 
						success: function (resposta) {
							
							if (resposta==0){
							app.dialog.close();
								app.dialog.prompt('Informe a nova senha:','<b>NOVA SENHA</b>', function (senha) {
									criarNovaSenha(senha);
								});
							
							}
							
							if (resposta==1){
								app.dialog.close();
								app.dialog.alert('Por favor, informe um código válido!','<b>CÓDIGO INVÁLIDO</b>');
							}
							
							if (resposta==2){
								app.dialog.close();
								app.dialog.alert('Houve um problema. Tente novamente','<b>OPS!</b>');
							}
							
						},
							
						error: function (erro) {
							app.dialog.close();
							app.dialog.alert('Não foi possivel se conectar ao servidor');								   
						},
						
						
						});
						
						
					}
					
					function criarNovaSenha(senha){
						
						app.dialog.close();
						
						app.dialog.preloader('Salvando nova senha');						
						var email=localStorage.getItem('emailValido');
						
						$.ajax({
						type: 'POST', 
						data: {email:email,senha:senha,chave:'123'}, 
						url: 'https://genialcursos.com.br/app/salvar-nova-senha.php',  
							 
						success: function (resposta) {
							
							if (resposta==0){
							app.dialog.close();
						    app.dialog.alert('Nova senha gerada. Você já pode fazer login com ela!','<b>SUCESSO!</b>');							
							}
							
							if (resposta==1){
								app.dialog.close();
								app.dialog.alert('Por favor, informe um código válido!','<b>CÓDIGO INVÁLIDO</b>');
							}
							
							if (resposta==2){
								app.dialog.close();
								app.dialog.alert('Houve um problema. Tente novamente','<b>OPS!</b>');
							}
							
						},
							
						error: function (erro) {
							app.dialog.close();
							app.dialog.alert('Não foi possivel se conectar ao servidor');								   
						},
						
						
						});
						
						
					}

                    }
               }
        },
{
            path: '/destino/',
            url: 'destino.html',
            on: {
                pageInit: function (event, page) {
				
						//MODELO DE ROTA PRONTA PARA COPIAR

                    }
               }
        },		
        {
            path: '/new/',
            url: 'new.html',
            on: {
                pageInit: function (event, page) {
				
						//MODELO DE ROTA PRONTA PARA COPIAR

                    }
               }
        },
    ],
    // ... other parameters
});

var $$=Dom7;

//QUANDO O DISPOSITIVO ESTIVER PRONTO
function onDeviceReady() {
	
	//DISPOSITIVO PRONTO INICIALIZAR POR ESSA ROTA
    var mainView = app.views.create('.view-main', {
        url: '/index/'
    });
	
	 //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID 	
	 document.addEventListener("backbutton", onBackKeyDown, false);

//FUNCÃO QUANDO CLICAR NO BOTAO VOLTAR NATIVO
function onBackKeyDown() {
	
	//VARIAVEL PARA VER EM QUE ROTA ESTAMOS
	var nome=app.views.main.router.url;
    
	//EXEMPLO DE VOLTAR:	
	//if (nome=='/home/'){
	//app.views.main.router.navigate('/index/');	
	//}
	
	
	
}

}