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

						var wlogin = localStorage.getItem("ls_nome_grupoAtual");
						if (wlogin==null){
                          app.views.main.router.navigate('/abertura/');
						}else{
						  //app.views.main.router.navigate('/inicio/');
						  app.views.main.router.navigate('/home/');
						}
                    	
                    }, 5500);
					
					

                    }
               }
        },
		{
            path: '/home/',
            url: 'home.html',
            on: {
                pageInit: function (event, page) {
					
						//CONTEÚDO DA PÁGINA PRINCIPAL AQUI
						
						//comando para criar banco ou abrir se já existir
						db=window.openDatabase("BancoFR","1.0","Banco Futebol e Resenha",25000000);
						
						//criar transaction
						db.transaction(criarTabelaAtleta,erroMensagem,sucessoMensagem);
						db.transaction(criarTabelaGrupo,erroMensagem,sucessoMensagem);
						db.transaction(criarTabelaAtividade,erroMensagem,sucessoMensagem);
						db.transaction(criarTabelaChegadaAtividade,erroMensagem,sucessoMensagem);
						function criarTabelaAtleta(tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS Atletas(apelido VARCHAR(255), id_gp INTEGER(11), nome VARCHAR(255),posicao VARCHAR(255),melhorpe VARCHAR(255), camisa VARCHAR(255),velocidade VARCHAR(255),habilidade VARCHAR(255),dtnasc date(10),fone varchar(255),fundador varchar(1),diretoria varchar(1),efetivo varchar(1),convidado varchar(1))");
						}			

						function criarTabelaGrupo(tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS Grupos(id_gp INTEGER primary key, nome_gp VARCHAR(255),tipo_gp VARCHAR(255),local_gp VARCHAR(255),bairro_gp VARCHAR(255), cidade_gp VARCHAR(255),uf_gp VARCHAR(255),diasemana_gp VARCHAR(255),horario_gp VARCHAR(255))");
						}			

						function criarTabelaAtividade(tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS Atividades(id_atv INTEGER primary key, id_gp INTEGER(11), data_atv VARCHAR(255),hora_atv VARCHAR(255),local_atv VARCHAR(255),status_atv VARCHAR(255))");
						}			

						function criarTabelaChegadaAtividade(tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS chegada_atvidade(id_chegada INTEGER primary key,id_atv INTEGER(11), id_gp INTEGER(11),apelido VARCHAR(255), data_atv VARCHAR(255),hora_atv VARCHAR(255),status_atv VARCHAR(255))");
						}			

						var wgrupo = localStorage.getItem("ls_nome_grupoAtual");
						if (wgrupo!=null){
							$("#titleApphome").html(wgrupo);
						}else{
							$("#titleApphome").html('Futebol e Resenha');
						}

				}	
               }
        },
		{
            path: '/atletas/',
            url: 'peladeiros.html',
            on: {
                pageInit: function (event, page) {
				wgrupo = localStorage.getItem("ls_nome_grupoAtual");
				if (wgrupo == null){
					app.views.main.router.navigate('/home/');	
//					app.dialog.alert('Favor, primeiro cadastrar ou escolher um grupo!','<center>ATENÇÃO!!!</center>');
				}else{
					$("#titleAppAtletas").html(' Atletas - '+wgrupo);

					walterar="N";
					transactionResultados_at();
					function transactionResultados_at(){
						db.transaction(selecionarResultados_at,erroMensagem,sucessoMensagem);
					}
					function selecionarResultados_at(tx){
						wgrupo = localStorage.getItem("ls_id_grupoAtual");
						tx.executeSql('SELECT * FROM Atletas where id_gp="'+wgrupo+'" order by apelido',[],resultadosSelecao_at,erroMensagem);
					};				
					
					function resultadosSelecao_at(tx,results){
						var linhas = results.rows.length;
						var wgpatual = localStorage.getItem("ls_id_grupoAtual");

						$("#listaAtletas").empty();
						for (i=0;i<linhas;i++){
							
						if (results.rows.item(i).fundador == "N" && results.rows.item(i).diretoria == "N" && results.rows.item(i).efetivo == "N" && results.rows.item(i).convidado == "N") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
							//'<div class="item-media"><img src=img/foto.png width=40</div>'+		
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'</div>'+
								'*** | '+results.rows.item(i).nome+
								'<div class="item-footer">'+results.rows.item(i).fone+'</div>'+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							}else if (results.rows.item(i).fundador == "N" && results.rows.item(i).diretoria == "N" && results.rows.item(i).efetivo == "N" && results.rows.item(i).convidado == "S") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'   |  '+results.rows.item(i).fone+'</div>'+
								'conv | '+results.rows.item(i).nome+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							}else if (results.rows.item(i).fundador == "N" && results.rows.item(i).diretoria == "N" && results.rows.item(i).efetivo == "S" && results.rows.item(i).convidado == "N") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'   |  '+results.rows.item(i).fone+'</div>'+
								'Efet | '+results.rows.item(i).nome+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							}else if (results.rows.item(i).fundador == "N" && results.rows.item(i).diretoria == "S" && results.rows.item(i).efetivo == "S" && results.rows.item(i).convidado == "N") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'   |  '+results.rows.item(i).fone+'</div>'+
								'Dir,Efe | '+results.rows.item(i).nome+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							}else if (results.rows.item(i).fundador == "S" && results.rows.item(i).diretoria == "S" && results.rows.item(i).efetivo == "S" && results.rows.item(i).convidado == "N") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'   |  '+results.rows.item(i).fone+'</div>'+
								'Fun,Dir | '+results.rows.item(i).nome+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							}else if (results.rows.item(i).fundador == "S" && results.rows.item(i).diretoria == "N" && results.rows.item(i).efetivo == "S" && results.rows.item(i).convidado == "N") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'   |  '+results.rows.item(i).fone+'</div>'+
								'Fun,Efe | '+results.rows.item(i).nome+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							}else if (results.rows.item(i).fundador == "N" && results.rows.item(i).diretoria == "N" && results.rows.item(i).efetivo == "S" && results.rows.item(i).convidado == "N") {	
							$("#listaAtletas").append('<li>'+
							'<a href="#" data-apelido="'+results.rows.item(i).apelido+
							'"data-nome="'+results.rows.item(i).nome+
							'"data-fone="'+results.rows.item(i).fone+
							'"data-id_gp="'+results.rows.item(i).id_gp+
							'" class="item-link item-content">'+
								'<div class="item-inner">'+
								'<div class="item-title">'+
								'<div class="item-header" style="color:green">'+results.rows.item(i).apelido+'   |  '+results.rows.item(i).fone+'</div>'+
								'Efe | '+results.rows.item(i).nome+
								'</div>'+
								'</div>'+
								'</a>'+
								'</li>');
							
							};
							
							
						}	
						

						$(".item-link").on("click",function(){
							wapelido=$(this).attr("data-apelido");
							wid_gp=$(this).attr("data-id_gp");
							walterar="S";
							// Vertical Buttons
							  app.dialog.create({
								title: '<i class="mdi mdi-settings"></i> Opções',
								text: 'Escolha uma das opções abaixo: ',
								buttons: [
								  {
									text: '<i class="mdi mdi-refresh"></i> Alterar dados',
									color: 'blue',
									onClick: function(){
									app.views.main.router.navigate('/cadatletas/');
									
									
									}
								  },
								  {
									text: '<i class="mdi mdi-delete-alert"></i> Excluir Atleta',
									color: 'red',
									onClick: function(){
									app.dialog.confirm('<center>Excluir atleta abaixo? <br><br><b>'+wapelido+'</b></center>','<center>ATENÇÃO !!!</center>', function () {
										transactionDeletar_at();
										
	//									app.dialog.alert('<center>Exclusão efetuada!</center>','<center>SUCESSO !!!</center>');
									});
									
									}	
								  },
								  {
									text: '<i class="mdi mdi-delete-alert"></i> Cancelar',
									color: 'green',
									onClick: function(){
									app.dialog.close();
									}
									
								  },
								],
								verticalButtons: true,
							  }).open();

						});
						
					
					};
				};

            }
               }
        },
		
		{
            path: '/cadatletas/',
            url: 'cadpeladeiros.html',
            on: {
                pageInit: function (event, page) {
				
						var wgrupo = localStorage.getItem("ls_nome_grupoAtual");
						if (wgrupo!=""){
								$("#titleAppCadAtletas").html(' Cadastro Atleta - '+wgrupo);
							}else{
								$("#titleAppCadAtletas").html(' Cadastro Atleta');
							};

								$("#cpefetivo").on("click",function(){
							if ($("#cpefetivo").is(":checked")){
								$("#cpconvidado").prop('checked', false);
							}
						});

						$("#cpconvidado").on("click",function(){
							if ($("#cpconvidado").is(":checked")){
								$("#cpefetivo").prop('checked', false);
							}
						});


					//COLOCAR OPÇÕES DE TIRAR FOTOS	
						//OPÇÕES DE ACTION GRID
						var AbrirOpcoes = app.actions.create({
						  grid: true,
						  buttons: [
							[
							  {
								text: '<b>Câmera</b>',
								icon: '<img src="img/camera-icon.png" width="48"/>',
								onClick: function () {
									tirarFoto();
								  }
							  },
							  {
								text: '',
								icon: ''
							  },
							  {
								text: '<b>Galeria</b>',
								icon: '<img src="img/galery-icon.png" width="48">',
								onClick: function () {
									abrirGaleria();
								  }
							  },
							]
						  ]
						});

						//QUANDO CLICAR NA IMAGEM ABRIR OPÇÕES
						$$('#imagemPerfil').on('click', function () {
							AbrirOpcoes.open();
						});
						
						 //FUNÇÃO PARA TIRAR FOTO A PARTIR DA CAMERA
						function tirarFoto() {
                        navigator.camera.getPicture(onSuccess, onFail, {
                            quality: 50,
                            saveToPhotoAlbum: true,
                            sourceType: navigator.camera.PictureSourceType.CAMERA,
                            correctOrientation: true,
                            destinationType: Camera.DestinationType.FILE_URI
                        });
						}

                        //CASO DE SUCESSO AO TIRAR FOTO 
                        function onSuccess(imageURI) {
                            var image = document.getElementById('imagemPerfil');
                            image.src = imageURI;
                            app.preloader.show();
							
							//LOCALIZAÇÃO LOCAL DA FOTO
							$("#local").html(imageURI);
							
						} 

					//FUNÇÃO PARA TIRAR FOTO A PARTIR DA GALERIA
                    function abrirGaleria() {
                        navigator.camera.getPicture(onSuccess, onFail, {
                            quality: 50,
                            saveToPhotoAlbum: true,
                            sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM,
                            correctOrientation: true,
                            destinationType: Camera.DestinationType.FILE_URI
						});
					}
					
                        //CASO DE SUCESSO AO TIRAR FOTO 
                        function onSuccess(imageURI) {
                            var image = document.getElementById('imagemPerfil');
                            image.src = imageURI;
                            app.preloader.show();
						}

						//MODELO DE ROTA PRONTA PARA COPIAR
						$('#cpfone').mask('(00)90000-0000');
					    $('#cpdtnasc').mask('00/00/0000');
						$('#cpcamisa').mask('000');
						$('#cpvelocidade').mask('0');
						$('#cphabilidade').mask('0');


						$("#BotaoSalvar").on("click",function(){
							wid_gp = localStorage.getItem('ls_id_grupoAtual');
							wapelido=$("#cpapelido").val();
							wnome=$("#cpnome").val();

							if (wapelido=='' || wnome=='' || wid_gp==''){
								app.dialog.alert('preencha todos os campos','<b>Ops!</b>');	
							}else{
								//criar transaction

/*								db.transaction(verificar_duplicidade_at,erroMensagem,naoduplicidade);
								
								verificar_duplicidade_at(tx) {
									tx.executeSql('SELECT * FROM Atletas where apelido="'+wapelido+'" and id_gp="'+wid_gp+'",[],resultadosSelecao_at,erroMensagem);
								};

								if wlinha>0 {
										app.dialog.alert(wapelido+' já está cadastrado no grupo!');	
								}else{
*/

								db.transaction(inserir_at,erroMensagem,at_inserirSucessoMensagem);
								app.views.main.router.navigate('/atletas/');
								function at_inserirSucessoMensagem() {
									app.dialog.alert('Incluido com Sucesso!!!','<b>SUCESSO</B>');
									app.views.main.router.refreshPage();
								};

								}
//							}
							
						});
					}
               }
        },

		{
            path: '/cadgrupos/',
            url: 'cadgrupos.html',
            on: {
                pageInit: function (event, page) {
				
						//MODELO DE ROTA PRONTA PARA COPIAR
						
						if (walterar=="S"){
							$("#atualizargrupo").removeClass("display-none");
							$("#salvargrupo").addClass("display-none");
							$("#cpnomegrupo").val(wnome_gp);		
							$("#cplocal").val(wlocal_gp);		
							$("#cpbairro").val(wbairro_gp);		
							$("#cpcidade").val(wcidade_gp);		
							$("#cpuf").val(wuf_gp);		
							$("#cpdiasemana").val(wdiasemana);		
							$("#cphorario").val(whorario);		
							//$("#cpfoto_gp").val(wfoto_gp);	
							wnome_gp_ant = 	wnome_gp;
						};
						
						$('#cphorario').mask('00:00');



						// BOTÃO ATUALIZAR GRUPO
						$("#atualizargrupo").on("click",function(){
						wnome_gp=$("#cpnomegrupo").val();
						wtipo_gp=$("#cptipo").val();
						if (wnome_gp==wnome_gp) {
							if (wnome_gp=='' || wtipo_gp==''){
								app.dialog.alert('preencha todos os campos','<b>Ops!</b>');	
							}else{							
								//criar transaction
								db.transaction(atualizar_gp,erroMensagem,sucessoMensagem);
								function atualizar_gp(tx){
									tx.executeSql('Update Grupos set nome_gp="'+wnome_gp+'" where id_gp="'+wid_gp+'"',[],alterarSucessoMensagem,erroMensagem);
								};
								
								app.views.main.router.navigate('/grupos/');

							}
						}else{
						transactionResultados_DP_GP();
						function transactionResultados_DP_GP(){
							db.transaction(selecionarResultados_DP_GP,erroMensagem,sucessoMensagem);
						}
						function selecionarResultados_DP_GP(tx){
							tx.executeSql('SELECT * FROM Grupos where nome_gp="'+wnome_gp+'"',[],resultadosSelecao_DP_GP,erroMensagem);
						};				
						
						function resultadosSelecao_DP_GP(tx,results){
							wlinhas = results.rows.length;
							if (wlinhas < 1){
									if (wnome_gp=='' || wtipo_gp==''){
										app.dialog.alert('preencha todos os campos','<b>Ops!</b>');	
									}else{							
										//criar transaction
										db.transaction(inserir_gp,erroMensagem,inserirSucessoMensagem);
										
										
										transactionResultados_last_GP();
										function transactionResultados_last_GP(){
											app.dialog.alert('1ª func');
											db.transaction(selecionarResultados_last_GP,erroMensagem,sucessoMensagem);
										}
										function selecionarResultados_last_GP(tx){
											app.dialog.alert('2ª func');
											tx.executeSql('SELECT last(id_gp) s_id_gp  FROM Grupos',[],resultadosSelecao_last_GP,erroMensagem);
										};				

										function resultadosSelecao_last_GP(tx,results){
											app.dialog.alert('3ª func');
											wlinhas_last = results.rows.s_id_gp;
											app.dialog.alert(wlinhas_last);
										};
										
										app.views.main.router.navigate('/grupos/');

									}
							}else{
									app.dialog.alert('Já existe um Grupo esse nome!');
								}
							};
							
							};
						});



						//BOTÃO SALVAR GRUPO
						$("#salvargrupo").on("click",function(){
						wnome_gp=$("#cpnomegrupo").val();
						wtipo_gp=$("#cptipo").val();

						transactionResultados_DP_GP();
						function transactionResultados_DP_GP(){
							db.transaction(selecionarResultados_DP_GP,erroMensagem,sucessoMensagem);
						}
						function selecionarResultados_DP_GP(tx){
							tx.executeSql('SELECT * FROM Grupos where nome_gp="'+wnome_gp+'"',[],resultadosSelecao_DP_GP,erroMensagem);
						};				
						
						function resultadosSelecao_DP_GP(tx,results){
							wlinhas = results.rows.length;
							if (wlinhas < 1){
									if (wnome_gp=='' || wtipo_gp==''){
										app.dialog.alert('preencha todos os campos','<b>Ops!</b>');	
									}else{							
										//criar transaction
										db.transaction(inserir_gp,erroMensagem,inserirSucessoMensagem);
										app.views.main.router.navigate('/grupos/');

									}
							}else{
									app.dialog.alert('Já existe um Grupo esse nome!');
								}
						};
	

						});

                    }
               }
        },

        {
            path: '/grupos/',
            url: 'grupos.html',
            on: {
                pageInit: function (event, page) {
				
				walterar="N";
				transactionResultados_gp();
				function transactionResultados_gp(){
					db.transaction(selecionarResultados_gp,erroMensagem,sucessoMensagem);
				}
				function selecionarResultados_gp(tx){
					tx.executeSql('SELECT * FROM Grupos order by nome_gp',[],resultadosSelecao_gp,erroMensagem);
				};				
				
				function resultadosSelecao_gp(tx,results){
					var linhas = results.rows.length;
					var wgpatual = localStorage.getItem("ls_id_grupoAtual");

					$("#listaGrupos").empty();
					for (i=0;i<linhas;i++){
						if (wgpatual == results.rows.item(i).id_gp){
							$("#listaGrupos").append('<li>'+
							'<a href="#" data-nome="'+results.rows.item(i).nome_gp+'" data-local="'+results.rows.item(i).local_gp+'" data-bairro="'+results.rows.item(i).bairro_gp+'" data-cidade="'+results.rows.item(i).cidade_gp+'" data-uf="'+results.rows.item(i).uf_gp+'" data-id="'+results.rows.item(i).id_gp+'" data-id="'+results.rows.item(i).diasemana_gp+'" data-id="'+results.rows.item(i).horario_gp+'" class="item-link item-content">'+
					//		'<div class="item-media"><img src=img/escudo.png width=40</div>'+		
							'<div class="item-inner">'+
							'<div class="item-title">'+
							'<div class="item-header" style="color:green">'+results.rows.item(i).nome_gp+'</div>'+
							'| '+results.rows.item(i).tipo_gp+
							'<div class="item-footer">'+results.rows.item(i).local_gp+' - '+results.rows.item(i).cidade_gp+' - '+results.rows.item(i).uf_gp+'</div>'+
							'</div>'+
							//'<div class="item-after">Grupo Atual</div>'+
							'<div class="item-after" style="color:green"><i id="icone" class="mdi mdi-soccer"></i>  Grupo Atual</div>'+
							'</div>'+
							'</a>'+
							'</li>');
						}else{
							$("#listaGrupos").append('<li>'+
							'<a href="#" data-nome="'+results.rows.item(i).nome_gp+'" data-local="'+results.rows.item(i).local_gp+'" data-bairro="'+results.rows.item(i).bairro_gp+'" data-cidade="'+results.rows.item(i).cidade_gp+'" data-uf="'+results.rows.item(i).uf_gp+'" data-id="'+results.rows.item(i).id_gp+'" data-diasemana="'+results.rows.item(i).diasemana_gp+'" data-horario="'+results.rows.item(i).horario_gp+'"class="item-link item-content">'+
					//		'<div class="item-media"><img src=img/escudo.png width=40</div>'+		
							'<div class="item-inner">'+
							'<div class="item-title">'+
							'<div class="item-header">'+results.rows.item(i).nome_gp+'</div>'+
							'| '+results.rows.item(i).tipo_gp+
							'<div class="item-footer">'+results.rows.item(i).local_gp+' - '+results.rows.item(i).cidade_gp+' - '+results.rows.item(i).uf_gp+'</div>'+
							'</div>'+
							'</div>'+
							'</a>'+
							'</li>');
						}
					}	
					$(".item-link").on("click",function(){
						wid_gp=$(this).attr("data-id");
						wnome_gp=$(this).attr("data-nome");
						wlocal_gp=$(this).attr("data-local");
						wbairro_gp=$(this).attr("data-bairro");
						wcidade_gp=$(this).attr("data-cidade");
						wuf_gp=$(this).attr("data-uf");
						wdiasemana=$(this).attr("data-diasemana");
						whorario=$(this).attr("data-horario");
						walterar="S";
						// Vertical Buttons
						  app.dialog.create({
							title: '<i class="mdi mdi-settings"></i> Opções',
							text: 'Escolha uma das opções abaixo: ',
							buttons: [
							  {//DEFINIR GRUPO COMO PADRÃO
								text: '<i class="mdi mdi-home-group"></i> Definir como Padrão',
								color: 'green',
								onClick: function(){
										localStorage.setItem("ls_id_grupoAtual", wid_gp);
										localStorage.setItem("ls_nome_grupoAtual", wnome_gp);
										app.dialog.close();
										app.views.main.router.navigate('/home/');
								}
							  },
							  {//ALTERAR DADOS DO GRUPO
								text: '<i class="mdi mdi-refresh"></i> Alterar dados',
								color: 'blue',
								onClick: function(){
								localStorage.setItem("ls_id_grupoAtual", wid_gp);
								localStorage.setItem("ls_nome_grupoAtual", wnome_gp);
								app.views.main.router.navigate('/cadgrupos/');
								}
							  },
							  { //EXCLUIR GRUPO
								text: '<i class="mdi mdi-delete-alert"></i> Excluir grupo',
								color: 'red',
								onClick: function(){
								
								app.dialog.confirm('<center>Excluir grupo abaixo? <br><br><b>'+wnome_gp+'</b></center>','<center>ATENÇÃO !!!</center>', function () {
									transactionDeletar_gp();
								});
								
								}	
							  },
							  {
								text: '<i class="mdi mdi-delete-alert"></i> Cancelar',
								color: 'orange',
								onClick: function(){
										app.dialog.close();
								}
								
							  },
							],
							verticalButtons: true,
						  }).open();

					});
					
				};


                    }
               }
        },
		
        {
            path: '/abertura/',
            url: 'abertura.html',
            on: {
                pageInit: function (event, page) {
				
				setTimeout(function(){ 
					app.dialog.alert('<img src="img/sleft.gif" style="max-width:100%"','')				
				; }, 500);

												}
				}
        },

        {
            path: '/atividades/',
            url: 'atividades.html',
            on: {
                pageInit: function (event, page) {
				
						//MODELO DE ROTA PRONTA PARA COPIAR

						wgpatual = localStorage.getItem("ls_id_grupoAtual");
						transactionResultados_atv();
						function transactionResultados_atv(){
							db.transaction(selecionarResultados_atv,erroMensagem,sucessoMensagem);
						}
						function selecionarResultados_atv(tx){
							tx.executeSql('SELECT * FROM Atividades where id_gp="'+wgpatual+'" order by data_atv',[],resultadosSelecao_atv,erroMensagem);
						};				
						
						function resultadosSelecao_atv(tx,results){
							var linhas = results.rows.length;

							$("#listaAtividades").empty();
							
							for (i=0;i<linhas;i++){
								if (wgpatual == results.rows.item(i).id_gp){
									$("#listaAtividades").append('<li>'+
									'<a href="#" class="item-link item-content">'+
										'<div class="item-inner">'+
										  '<div class="item-title">'+
											'<div class="item-header">'+results.rows.item(i).data_atv+' - '+results.rows.item(i).hora_atv+'</div>'+
											results.rows.item(i).local_atv+
										  '</div>'+
										  '<div class="item-after">'+results.rows.item(i).status_atv+'</div>'+
										'</div>'+
									  '</a>'+
									'</li>');
								}
							}
						}
						
						
					//	$('#tab-2').on('tab:show',function(){						
						
						$('#sel_atleta').on('click',function(){						
						transactionResultados_sel();
						function transactionResultados_sel(){
							db.transaction(selecionarResultados_sel,erroMensagem,sucessoMensagem);
						}
						function selecionarResultados_sel(tx){
							tx.executeSql('SELECT apelido FROM Atletas tb_at where id_gp="'+wgpatual+'"order by apelido',[],resultadosSelecao_sel,erroMensagem);
						};	
						//tx.executeSql('SELECT apelido FROM Atletas tb_at where id_gp="'+wgpatual+'" and NOT EXISTS(SELECT apelido FROM chegada_atvidade tb_ch where tb_at.apelido = tb_ch.apelido) order by apelido',[],resultadosSelecao_sel,erroMensagem);
						//NOT EXISTS(SELECT * FROM tb2 t2 where t1.id = t2.id);
						
						function resultadosSelecao_sel(tx,results){
							var linhas = results.rows.length;
								
							$("#sel_atleta").empty();
							
							for (i=0;i<linhas;i++){
								if (1 == 1){
									$("#sel_atleta").append(
										'<option value="'+results.rows.item(i).rowid+'">'+results.rows.item(i).apelido+'</option>'

						//'<a href="#" data-nome="'+results.rows.item(i).nome_gp+'" data-local="'+results.rows.item(i).local_gp+'" data-bairro="'+results.rows.item(i).bairro_gp+'" data-cidade="'+results.rows.item(i).cidade_gp+'" data-uf="'+results.rows.item(i).uf_gp+'" data-id="'+results.rows.item(i).id_gp+'" data-id="'+results.rows.item(i).diasemana_gp+'" data-id="'+results.rows.item(i).horario_gp+'" class="item-link item-content">'+

						//wid_gp=$(this).attr("data-id");

									
									);
								}
							}
						}
						
						});
						
						$(".item-link").on("click",function(){
							
							
						});

                    }
               }
        },
        {
            path: '/cadAtividades/',
            url: 'cadatividades.html',
            on: {
                pageInit: function (event, page) {
				
						//MODELO DE ROTA PRONTA PARA COPIAR


						//MODELO DE ROTA PRONTA PARA COPIAR
					    $('#cpdtatv').mask('00/00/0000');
						$('#cphora').mask('00:00');


						//BOTÃO SALVAR ATIVIDADE
						$("#salvaratv").on("click",function(){
						wlocal_atv=$("#cplocalatv").val();
						wdata_atv=$("#cpdtatv").val();
						whora_atv=$("#cphora").val();

						transactionResultados_atv();
						function transactionResultados_atv(){
//							db.transaction(selecionarResultados_atv,erroMensagem,sucessoMensagem);
						db.transaction(inserir_atv,erroMensagem,inserirSucessoMensagem);

						}
						
						/*
						function selecionarResultados_atv(tx){
							tx.executeSql('SELECT * FROM Atvidades where data_atv="'+wdata_atv+'", and hora_atv="'+whora_atv+'"',[],resultadosSelecao_atv,erroMensagem);
						}; */				
						
						
						/*
						function resultadosSelecao_atv(tx,results){
							wlinhas = results.rows.length;
							if (wlinhas < 1){
									if (wdata_atv=='' || whora_atv==''){
										app.dialog.alert('preencha todos os campos','<b>Ops!</b>');	
									}else{							
										//criar transaction
										db.transaction(inserir_atv,erroMensagem,inserirSucessoMensagem);
										app.views.main.router.navigate('/atividades/');

									}
							}else{
									app.dialog.alert('Já existe uma atividade desse grupo nessa data e jpra!');
								}
						}; */
	

						});



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


// FUNÇÃO GENERICA DE ERRO ABERTURA DE BANCO / TABELAS
function erroMensagem(erro) {
	app.dialog.alert('Erro: '+erro.message);			
	};			

// FUNCÃO GENERICA DE SUCESSO COM O BANCO / TABELAS
function inserirSucessoMensagem() {
	app.dialog.alert('Incluido com Sucesso!!!','<b>SUCESSO</B>');
	app.views.main.router.refreshPage();
};

// FUNCÃO GENERICA DE SUCESSO COM O BANCO / TABELAS
function alterarSucessoMensagem() {
	app.dialog.alert('Alterado com Sucesso!!!','<b>SUCESSO</B>');
	app.views.main.router.refreshPage();
};

// FUNCÃO GENERICA DE SUCESSO SEM PRECISAR FAZER NADA
function sucessoMensagem() {
	// NÃO PRECISA FAZER NADA!
	};	

function transactionDeletar_gp(){
	db.transaction(deletar_gp,erroMensagem,DeletarsucessoMensagem);
	
};

function deletar_gp(tx){
	tx.executeSql("delete from Grupos where id_gp = '"+wid_gp+"'");
};

function transactionDeletar_at(){
	db.transaction(deletar_at,erroMensagem,DeletarsucessoMensagem);
	
};

function deletar_at(tx){
	tx.executeSql("delete from Atletas where id_gp = '"+wid_gp+"' and apelido='"+wapelido+"'");
};

function DeletarsucessoMensagem(){
	app.dialog.alert("Excluido com sucesso!!!","SUCESSO!!!");
	app.views.main.router.refreshPage();
};

function inserir_at(tx){
		var wfone=$("#cpfone").val();
		var wposicao=$("#cpposicao").val();
		var wmelhorpe=$("#cpmelhorpe").val();
		var wcamisa=$("#cpcamisa").val();
		var wvelocidade=$("#cpvelocidade").val();
		var whabilidade=$("#cphabilidade").val();
		var wdtnasc=$("#cpdtnasc").val();

		if ($("#cpfundador").is(":checked")){
			var wfundador = "S";
		}else {
			var wfundador = "N";								
		}

		if ($("#cpdiretoria").is(":checked")){
			var wdiretoria = "S";
		}else {
			var wdiretoria = "N";								
		}
		if ($("#cpefetivo").is(":checked")){
			var wefetivo = "S";
		}else {
			var wefetivo = "N";								
		}
		if ($("#cpconvidado").is(":checked")){
			var wconvidado = "S";
		}else {
			var wconvidado = "N";								
		}
	
	tx.executeSql("INSERT INTO Atletas (id_gp, apelido, nome, posicao, melhorpe, camisa, velocidade, habilidade, dtnasc, fone, fundador, diretoria,efetivo,convidado) VALUES ('"+wid_gp+"','"+wapelido+"' , '"+wnome+"' , '"+wposicao+"' , '"+wmelhorpe+"' , '"+wcamisa+"' , '"+wvelocidade+"' , '"+whabilidade+"' ,'"+wdtnasc+"' ,'"+wfone+"','"+wfundador+"','"+wdiretoria+"','"+wefetivo+"','"+wconvidado+"')");
};

/*

tx.executeSql("INSERT INTO Atletas (id_gp, apelido, nome, posicao, melhorpe, camisa, velocidade, habilidade, dtnasc, fone, fundador, diretoria,efetivo,convidado) VALUES ('"+wid_gp+"','"+wapelido+"' , '"+wnome+"' , '"+wposicao+"' , '"+wmelhorpe+"' , '"+wcamisa+"' , '"+wvelocidade+"' , '"+whabilidade+"' ,'"+wdtnasc+"' ,'"+wfone+"','"+wfundador+"','"+wdiretoria+"','"+wefetivo+"','"+wconvidado+"')");
*/

// FUNÇÃO INSERIR NO BANCO Atividades
function inserir_atv(tx){
	var wid_gp=$("#cpdtatv").val();
	var wdata_atv=$("#cpdtatv").val();
	var whora_atv=$("#cphora").val();
	var wlocal_atv=$("#cplocalatv").val();
	var wstatus_atv=$("#cpstatus_atv").val();
	
	wid_gp=localStorage.getItem("ls_id_grupoAtual");
	
	tx.executeSql("INSERT INTO Atividades(id_gp,data_atv, hora_atv, local_atv, status_atv) VALUES ('"+wid_gp+"' , '"+wdata_atv+"' , '"+whora_atv+"' , '"+wlocal_atv+"' , '"+wstatus_atv+"')");
};									




// FUNÇÃO INSERIR NO BANCO GRUPOS
function inserir_gp(tx){
	var wnomegp=$("#cpnomegrupo").val();
	var wtipo=$("#cptipo").val();
	var wlocal=$("#cplocal").val();
	var wbairro=$("#cpbairro").val();
	var wcidade=$("#cpcidade").val();
	var wuf=$("#cpuf").val();
	var wdia=$("#cpdiasemana").val();
	var whorario=$("#cphorario").val();
	
	tx.executeSql("INSERT INTO Grupos(nome_gp, tipo_gp, local_gp, bairro_gp, cidade_gp, uf_gp, diasemana_gp, horario_gp) VALUES ('"+wnomegp+"' , '"+wtipo+"' , '"+wlocal+"' , '"+wbairro+"' , '"+wcidade+"' , '"+wuf+"' , '"+wdia+"' ,'"+whorario+"')");
};									

/*
function inserirSucessoMensagem_gp() {
	app.dialog.alert('Gravado com Sucesso!!!','<b>SUCESSO</B>');
	app.views.main.router.refreshPage();	
};
*/

function resultadosSelecao_at(tx,results){
	wlinhas = results.rows.length;
};

				





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