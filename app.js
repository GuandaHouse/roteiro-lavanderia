let clients=[],order=[],gMap=null,gRoute=null,gMarkers=[],gBaseMarkers=[],hmMap=null,hmHeatLayer=null;
let imgData=null,ambRes=[],ambSel=-1,histIdx=-1,geoT=null,cfg={},_pendingCoords=null;
let selBoard=null,selList=null,_tboardsHtml='',_tlistsHtml='';


// ════════════════════════════════════════════════════════════
// SECTION: i18n
// ════════════════════════════════════════════════════════════

/* ══════════════════════════════════════════════════════════════
   v4.7.0: SISTEMA i18n (PT-BR + EN)
   ══════════════════════════════════════════════════════════════ */
let _lang=localStorage.getItem('rota_lang')||'pt';
const _i18n={
pt:{
  // Navigation
  'nav.rota':'Rota do Dia','nav.hist':'Hist\xf3rico','nav.dash':'Mapa de Clientes','nav.motor':'Motorista','nav.cfg':'Configura\xe7\xf5es',
  // Add client section
  'add.title':'Adicionar cliente','add.tab.trello':'Importar do Trello','add.tab.img':'Por Imagem','add.tab.file':'Arquivo','add.tab.man':'Manual',
  'add.data':'Dados do cliente','add.ai':'Preenchido pela IA',
  // Form labels
  'form.nome':'Nome *','form.nome.ph':'Nome completo','form.tel':'Telefone','form.tel.ph':'(11) 99999-9999',
  'form.end':'Endere\xe7o completo *','form.end.ph':'Rua, n\xba, complemento, bairro, cidade','form.cep':'CEP','form.cep.ph':'00000-000',
  'form.tipo':'Tipo *','form.qtd':'Quantidade','form.valstatus':'Status valor',
  'form.val':'Valor (R$)','form.val.ph':'0,00','form.medir':'Medir','form.pago':'Pago','form.normal':'Valor (R$)',
  'form.data':'Data','form.janela':'Janela de hor\xe1rio',
  'form.livre':'Qualquer hor\xe1rio','form.manha':'Somente manh\xe3 (at\xe9 12h)','form.tarde':'Somente tarde (ap\xf3s 12h)','form.custom':'Hor\xe1rio espec\xedfico',
  'form.hi':'In\xedcio','form.hf':'Fim','form.obs':'Observa\xe7\xf5es','form.obs.ph':'Port\xe3o azul, ligar antes...',
  // Buttons
  'btn.add':'+ Adicionar ao roteiro','btn.clear':'Limpar','btn.clearall':'Limpar todos','btn.save':'Salvar','btn.cancel':'Cancelar','btn.confirm':'Confirmar','btn.yes':'Sim','btn.no':'Não',
  'btn.delete':'Excluir','btn.close':'Fechar','btn.back':'Voltar','btn.search':'Buscar',
  'btn.generate':'Gerar rota','btn.publish':'Publicar rota no cloud','btn.insert':'Inserir cliente na rota ativa',
  'btn.genimg':'Gerar imagem do roteiro','btn.savecfg':'Salvar configura\xe7\xf5es','btn.undo':'Desfazer',
  'btn.change':'Trocar','btn.changefile':'Trocar arquivo','btn.preview':'Visualizar dados','btn.adjustcols':'Ajustar colunas',
  'btn.copylink':'Copiar link','btn.connect.trello':'Conectar com Trello','btn.disconnect':'Desconectar','btn.newtag':'Nova tag',
  // Client list
  'cl.title':'Clientes na rota','cl.empty':'Nenhum cliente ainda','cl.search':'Buscar por nome ou endere\xe7o...',
  // Summary
  'sum.title':'Resumo do dia','sum.clients':'Clientes','sum.pickups':'Retiradas','sum.deliveries':'Entregas','sum.items':'itens',
  // Map
  'map.title':'Rota no mapa','map.hint':'Adicione clientes para ver a rota','map.expand':'Expandir mapa','map.reduce':'Reduzir mapa',
  'map.panel':'Painel da Rota','map.dist':'Dist\xe2ncia total','map.time':'Tempo estimado','map.done':'Conclu\xeddos','map.last':'Última parada','map.stops':'Paradas',
  'map.arrival':'Chegada','map.departure':'Partida','map.return':'Retorno','map.remove':'Remover da rota',
  // Config
  'cfg.title':'Configura\xe7\xf5es','cfg.route':'Rota padr\xe3o','cfg.base':'Endere\xe7o de partida','cfg.ret':'Endere\xe7o de retorno',
  'cfg.saida':'Hor\xe1rio de sa\xedda','cfg.retlim':'Limite de retorno','cfg.tempo':'Tempo/parada (min)',
  'cfg.lunch1':'Pausa almo\xe7o \u2014 in\xedcio','cfg.lunch2':'Pausa almo\xe7o \u2014 fim',
  'cfg.tags':'Tags (cores dos cart\xf5es)','cfg.tagdesc':'Personalize as categorias e cores dos seus cart\xf5es. Arraste para reordenar.',
  'cfg.lang':'Idioma','cfg.lang.pt':'Portugu\xeas','cfg.lang.en':'English',
  // History
  'hist.title':'Hist\xf3rico de Rotas','hist.desc':'Todas as rotas geradas ficam salvas aqui.',
  // Dashboard
  'dash.title':'Concentra\xe7\xe3o de Clientes','dash.conc':'Concentra\xe7\xe3o','dash.rev':'Receita',
  'dash.top':'Locais mais atendidos','dash.zones':'Distribui\xe7\xe3o por Zona',
  // Motorista
  'mot.title':'Roteiro do Motorista','mot.scan':'Escaneie com o celular do motorista',
  // File import
  'fi.drag':'Arraste ou clique para importar','fi.types':'Excel (.xlsx), CSV ou TSV','fi.map':'Mapeamento de colunas','fi.preview':'Preview da importa\xe7\xe3o',
  'fi.sheet':'Aba da planilha','fi.ignore':'\u2014 Ignorar \u2014',
  // Toasts
  't.added':' adicionado!','t.removed':'Cliente removido','t.restored':'Rota restaurada!','t.discarded':'Rota descartada',
  't.published':'Rota publicada no cloud!','t.synced':'Dados offline sincronizados!','t.extracted':'Dados extra\xeddos!',
  't.optimized':'Rota otimizada gerada!','t.undone':'Altera\xe7\xe3o desfeita','t.imggen':'Imagem gerada!',
  't.imported':' clientes importados com sucesso!','t.orderupd':'Ordem atualizada \u2014 recalculando rota...',
  't.inserted':'Cliente inserido na rota: ','t.trelloconn':'Trello conectado com sucesso!','t.trellodisc':'Trello desconectado',
  // Errors
  'e.name':'Informe o nome','e.addr':'Informe o endere\xe7o','e.addrinv':'Endere\xe7o parece inv\xe1lido (inclua rua e n\xfamero)',
  'e.tag':'Selecione pelo menos uma tag','e.route':'Monte uma rota primeiro','e.baseaddr':'Endere\xe7o de partida n\xe3o encontrado',
  'e.noaddr':'Nenhum endere\xe7o encontrado','e.calc':'Erro ao calcular rota: ',
  'e.anthropic':'Configure a chave Anthropic','e.extract':'Erro na extra\xe7\xe3o. Verifique a chave Anthropic.',
  'e.credits':'Erro na API Anthropic \u2014 verifique seus cr\xe9ditos!',
  'e.trello.cfg':'Configure a chave e token do Trello em Configura\xe7\xf5es',
  'e.mapname':'Mapeie pelo menos a coluna Nome','e.mapaddr':'Mapeie pelo menos a coluna Endere\xe7o',
  // Confirms
  'c.restore':'Restaurar rota?','c.delete':'Excluir cliente?','c.clearroute':'Limpar rota?','c.replace':'Substituir rota atual?',
  'c.delroute':'Excluir rota?','c.noundo':'Esta a\xe7\xe3o n\xe3o pode ser desfeita.',
  'c.baseaddr.title':'Endere\xe7o de partida necess\xe1rio',
  'c.baseaddr.msg':'Para calcular os hor\xe1rios de chegada, o sistema precisa saber de onde o motorista sai. V\xe1 em Configura\xe7\xf5es e preencha o Endere\xe7o de partida.',
  // Trello
  'cfg.trello':'Trello','cfg.trello.connected':'Trello conectado',
  'cfg.trello.key':'Chave API Trello','cfg.trello.token':'Token Trello',
  'cfg.trello.redirect':'Voc\xea ser\xe1 redirecionado para autorizar o acesso. Nenhuma senha \xe9 compartilhada.',
  'cfg.trello.help':'Obtenha em','cfg.apiia':'API de IA','cfg.anthropic':'Chave Anthropic (extra\xe7\xe3o por IA)','cfg.gmaps':'Chave Google Maps',
  // Trello import
  'add.trello.date':'Data dos cart\xf5es','add.trello.search':'Buscar cart\xf5es','add.trello.found':'Cart\xf5es encontrados:',
  'add.trello.board':'1. Selecione o quadro:','add.trello.list':'2. Selecione a lista:',
  'add.trello.link':'Configurações','add.trello.chglist':'Lista','add.trello.chgboard':'Quadro',
  // Image import
  'add.img.paste':'Cole (Ctrl+V) ou arraste a imagem','add.img.hint':'Print de WhatsApp, Trello, etc.',
  'add.img.extract':'Extrair com IA','add.img.data':'Dados do cliente','add.img.ai':'Preenchido pela IA',
  // Map extras
  'map.calc':'Calculando rota...','map.gen':'Gerar roteiro',
  'map.genimg.desc':'Imagem com todas as paradas \u2014 f\xe1cil de enviar no WhatsApp',
  // Dashboard extras
  'dash.hint':'Salve rotas para ver a concentra\xe7\xe3o de clientes',
  // Modal titles
  'modal.edit':'Editar cliente','modal.insert':'Adicionar Cliente na Rota Ativa',
  'modal.insert.desc':'O cliente ser\xe1 inserido ap\xf3s as paradas j\xe1 conclu\xeddas.',
  'modal.ambiguous':'Endere\xe7o amb\xedguo','modal.ambiguous.desc':'Mais de um local encontrado. Confirme com o cliente e selecione:',
  // History modal
  'hist.load':'Carregar rota','hist.search':'Buscar rota...',
  // Motorista extras
  'mot.offline':'Offline','mot.updated':'Rota atualizada','mot.buildroute':'Monte uma rota primeiro',
  'mot.qr':'QR Code','mot.whatsapp':'WhatsApp',
  // Misc
  'misc.add':'Adicionar','misc.coletas':'coletas','misc.entregas':'entregas',
  // Zones
  'zone.north':'Norte','zone.south':'Sul','zone.east':'Leste','zone.west':'Oeste','zone.center':'Centro',
  // Stats dynamic
  'stats.clients_count':'{n} clientes','stats.routes_count':'{n} rotas','stats.bairros_count':'{n} bairros',
  'stats.coleta':'{n} coleta','stats.coletas':'{n} coletas','stats.entrega':'{n} entrega','stats.entregas':'{n} entregas',
  'stats.summary':'{clients} clientes \xb7 {coletas} coleta(s) / {entregas} entrega(s)',
  // History dynamic
  'hist.empty':'Nenhuma rota salva ainda','hist.search_ph':'Buscar por data, nome ou telefone...',
  'hist.load':'Carregar rota','hist.clients_summary':'{n} clientes \xb7 {col} coleta(s) / {ent} entrega(s)',
  'hist.search_client':'Buscar cliente...','hist.route_loaded':'Rota carregada!','hist.route_removed':'Rota removida',
  // Dashboard dynamic
  'dash.identifying':'Identificando bairros...','dash.no_bairros':'N\xe3o foi poss\xedvel identificar bairros.',
  // Motor dynamic
  'mot.stops':'Paradas','mot.pickup':'Retirar','mot.deliver':'Entregar','mot.completed':'Conclu\xeddos',
  'mot.departure':'Sa\xedda','mot.tracking':'Modo Acompanhamento',
  'mot.tracking_desc':'Rota publicada \u2014 o motorista est\xe1 usando pelo celular. Voc\xea v\xea as atualiza\xe7\xf5es em tempo real.',
  'mot.viewed_at':'Motorista visualizou \xe0s','mot.awaiting':'Aguardando motorista abrir a rota...',
  'mot.status_coletado':'Coletado','mot.status_entregue':'Entregue','mot.status_ausente':'Ausente',
  'mot.status_reagendar':'Reagendar','mot.status_reagendado':'Reagendado','mot.status_pendente':'Pendente',
  'mot.payment':'Pagamento','mot.pix_paid':'Pix (pago)','mot.pix_charge':'Pix (cobrar)',
  'mot.card':'Cart\xe3o','mot.cash':'Dinheiro','mot.no_info':'Sem info',
  'mot.coleta':'Coleta','mot.entrega':'Entrega','mot.concluir':'Concluir','mot.editar':'Editar',
  'mot.obs_placeholder':'Observa\xe7\xe3o...',
  // Completion summary
  'comp.stops':'{n} paradas','comp.completed':'Concluidos','comp.absent':'Ausentes',
  'comp.received':'Recebido','comp.to_charge':'A cobrar','comp.pickups':'Coletados','comp.deliveries':'Entregues',
  // Share
  'share.summary':'Resumo da Rota','share.completed':'conclu\xeddos','share.absent':'ausentes',
  // Map panel dynamic
  'map.panel_title':'Painel da Rota','map.undo_tip':'Desfazer (Ctrl+Z)','map.beyond_limit':'Al\xe9m do limite',
  'map.delayed':'{n} parada(s) com previs\xe3o de atraso','map.departure_return':'Partida / Retorno',
  // CEP messages
  'cep.searching':'Buscando...','cep.not_found':'CEP n\xe3o encontrado','cep.search_error':'Erro na busca',
  'cep.detected':'CEP detectado','cep.confirmed':'CEP confirmado','cep.valid':'CEP v\xe1lido',
  'cep.addr_updated':'Endere\xe7o atualizado via CEP.','cep.addr_filled':'Endere\xe7o preenchido via CEP. Adicione o n\xfamero.',
  // Misc dynamic messages
  'msg.optimizing':'Otimizando rota (motor v2)...','msg.optimized':'Rota otimizada!',
  'msg.optimized_nomap':'Rota otimizada! (sem mapa \u2014 Directions indispon\xedvel)',
  'msg.gen_image':'Gerando imagem...','msg.link_copied':'Link copiado!',
  'msg.client_updated':'Cliente atualizado!','msg.addr_confirmed':'Endere\xe7o confirmado!',
  'msg.publish_first':'Publique a rota no cloud primeiro','msg.driver_update':'Atualiza\xe7\xe3o do motorista recebida',
  'msg.new_day':'Novo dia! Rota anterior salva no hist\xf3rico.','msg.new_client':'Novo cliente adicionado:','msg.status_removed':'{name}: status removido',
  'msg.completed_client':'{name}: conclu\xedddo!','msg.editing':'{name}: editando...',
  // Error messages dynamic
  'err.publish':'Erro ao publicar:','err.connection':'Erro de conex\xe3o:',
  'err.fill_required':'Preencha nome e endere\xe7o','err.addr_invalid':'Endere\xe7o inv\xe1lido (m\xednimo 10 caracteres + n\xfamero)',
  'err.time_order':'Hor\xe1rio in\xedcio deve ser anterior ao fim','err.max_time':'Tempo por parada m\xe1ximo: 240 min',
  'err.lunch_order':'Pausa almo\xe7o: in\xedcio deve ser anterior ao fim',
  'err.no_tags':'Nenhuma tag dispon\xedvel','err.max_tags':'M\xe1ximo de 10 tags',
  'err.tag_exists':'Tag j\xe1 existe','err.tag_name':'Digite o nome da tag',
  'err.file_empty':'Arquivo vazio ou sem dados','err.excel_read':'Erro ao ler arquivo Excel:',
  'err.sheet_empty':'Aba vazia','err.no_valid':'Nenhum dado v\xe1lido encontrado',
  'err.no_valid_import':'Nenhum dado v\xe1lido para importar',
  'err.select_date':'Selecione uma data','err.no_boards':'Nenhum quadro encontrado',
  'err.fetch_boards':'Erro ao buscar quadros:','err.no_lists':'Nenhuma lista neste quadro',
  'err.fetch_lists':'Erro ao buscar listas','err.fetch_cards':'Erro ao buscar cart\xf5es',
  'err.configure_ai':'Configure Anthropic para importar com IA','err.select_card':'Selecione ao menos um cart\xe3o',
  'err.configure_trello_manual':'Configure a chave do app Trello primeiro (Configura\xe7\xe3o manual)',
  'err.qty_neg':'Quantidade n\xe3o pode ser negativa','err.val_neg':'Valor n\xe3o pode ser negativo',
  'err.start_addr':'Configure o endere\xe7o de partida!','err.addr_not_found':'Endere\xe7o n\xe3o encontrado:',
  'err.gen_image':'Erro ao gerar imagem:','err.calc_route':'Erro ao calcular rota:',
  // Confirm dialogs
  'confirm.restore_title':'Restaurar rota?',
  'confirm.restore_msg':'Voc\xea tem uma rota salva com {n} cliente(s) de {date}. Deseja restaurar?',
  'confirm.delete_title':'Excluir cliente?',
  'confirm.remove_client':'Remover <strong>{name}</strong> da rota?',
  'confirm.clear_title':'Limpar rota?',
  'confirm.clear_msg':'Remover <strong>{n}</strong> cliente(s) da rota? Esta a\xe7\xe3o n\xe3o pode ser desfeita.',
  'confirm.replace_title':'Substituir rota atual?',
  'confirm.replace_msg':'Isso ir\xe1 substituir os {n} clientes atuais pela rota do hist\xf3rico.',
  'confirm.delete_hist_title':'Excluir rota?',
  'confirm.delete_hist_msg':'Esta a\xe7\xe3o n\xe3o pode ser desfeita.',
  'confirm.base_addr_title':'Endere\xe7o de partida necess\xe1rio',
  'confirm.base_addr_msg':'Para calcular os hor\xe1rios de chegada, o sistema precisa saber de onde o motorista sai.<br><br>V\xe1 em <strong>Configura\xe7\xf5es</strong> e preencha o campo <strong>Endere\xe7o de partida</strong>.',
  'confirm.remove_toast':'Remover {name} da rota?',
  // Card labels
  'card.until_noon':'At\xe9 12h','card.after_noon':'Ap\xf3s 12h','card.arrival':'Chegada:',
  'card.conflict':'{n} conflito(s) de hor\xe1rio','card.risk':'{n} coleta(s) em risco',
  // Tag
  'tag.created':'Tag "{name}" criada!',
  // v4.7.2: Missing keys reconciliation
  'card.until':'Até',
  'cep.add_number':'Adicione o número do endereço',
  'cep.updated':'CEP atualizado',
  'comp.collected':'Coletados',
  'comp.delivered':'Entregues',
  'dash.bairro':'bairro',
  'dash.bairros':'bairros',
  'dash.plural':'bairros',
  'dash.rota':'rota',
  'dash.rotas':'rotas',
  'err.generic':'Erro inesperado. Tente novamente.',
  'err.unknown':'Erro desconhecido',
  'hist.all':'Todas',
  'hist.clients':'clientes',
  'mot.awaiting_driver':'Aguardando motorista',
  'mot.no_payment':'Sem pagamento registrado',
  't.clients_imported':'Clientes importados',
  't.lang_changed':'Idioma alterado',
  't.pdf_generated':'PDF gerado com sucesso',
  't.route_loaded':'Rota carregada',
  't.route_removed':'Rota removida',
  't.with_window':'com janela',
  'tag.enter_name':'Digite o nome da tag',
  'tag.exists':'Tag já existe',
  'tag.max_10':'Máximo de 10 tags',
  'tag.none_available':'Nenhuma tag disponível',
  'whatsapp.route':'Roteiro WhatsApp',
  'whatsapp.summary':'Resumo WhatsApp',
  // v4.7.2: Chart labels
  'mot.chart.status':'Status',
  'mot.chart.progress':'progresso',
  'mot.chart.payment':'Pagamento',
  'mot.chart.of':'de',
  'mot.chart.values':'Valores',
  'mot.chart.to_charge':'a cobrar',
  'mot.chart.received':'recebido'
},
en:{
  'nav.rota':'Daily Route','nav.hist':'History','nav.dash':'Client Map','nav.motor':'Driver','nav.cfg':'Settings',
  'add.title':'Add client','add.tab.trello':'Import from Trello','add.tab.img':'By Image','add.tab.file':'File','add.tab.man':'Manual',
  'add.data':'Client data','add.ai':'Filled by AI',
  'form.nome':'Name *','form.nome.ph':'Full name','form.tel':'Phone','form.tel.ph':'(11) 99999-9999',
  'form.end':'Full address *','form.end.ph':'Street, no., complement, neighborhood, city','form.cep':'ZIP','form.cep.ph':'00000-000',
  'form.tipo':'Type *','form.qtd':'Quantity','form.valstatus':'Value status',
  'form.val':'Value (R$)','form.val.ph':'0.00','form.medir':'Measure','form.pago':'Paid','form.normal':'Value (R$)',
  'form.data':'Date','form.janela':'Time window',
  'form.livre':'Any time','form.manha':'Morning only (until 12h)','form.tarde':'Afternoon only (after 12h)','form.custom':'Specific time',
  'form.hi':'Start','form.hf':'End','form.obs':'Notes','form.obs.ph':'Blue gate, call first...',
  'btn.add':'+ Add to route','btn.clear':'Clear','btn.clearall':'Clear all','btn.save':'Save','btn.cancel':'Cancel','btn.confirm':'Confirm','btn.yes':'Yes','btn.no':'No',
  'btn.delete':'Delete','btn.close':'Close','btn.back':'Back','btn.search':'Search',
  'btn.generate':'Generate route','btn.publish':'Publish route to cloud','btn.insert':'Insert client in active route',
  'btn.genimg':'Generate route image','btn.savecfg':'Save settings','btn.undo':'Undo',
  'btn.change':'Change','btn.changefile':'Change file','btn.preview':'Preview data','btn.adjustcols':'Adjust columns',
  'btn.copylink':'Copy link','btn.connect.trello':'Connect with Trello','btn.disconnect':'Disconnect','btn.newtag':'New tag',
  'cl.title':'Clients in route','cl.empty':'No clients yet','cl.search':'Search by name or address...',
  'sum.title':'Daily summary','sum.clients':'Clients','sum.pickups':'Pickups','sum.deliveries':'Deliveries','sum.items':'items',
  'map.title':'Route on map','map.hint':'Add clients to see the route','map.expand':'Expand map','map.reduce':'Reduce map',
  'map.panel':'Route Panel','map.dist':'Total distance','map.time':'Estimated time','map.done':'Completed','map.last':'Last stop','map.stops':'Stops',
  'map.arrival':'Arrival','map.departure':'Departure','map.return':'Return','map.remove':'Remove from route',
  'cfg.title':'Settings','cfg.route':'Default route','cfg.base':'Departure address','cfg.ret':'Return address',
  'cfg.saida':'Departure time','cfg.retlim':'Return deadline','cfg.tempo':'Time/stop (min)',
  'cfg.lunch1':'Lunch break \u2014 start','cfg.lunch2':'Lunch break \u2014 end',
  'cfg.tags':'Tags (card colors)','cfg.tagdesc':'Customize your card categories and colors. Drag to reorder.',
  'cfg.lang':'Language','cfg.lang.pt':'Portugu\xeas','cfg.lang.en':'English',
  'hist.title':'Route History','hist.desc':'All generated routes are saved here.',
  'dash.title':'Client Concentration','dash.conc':'Concentration','dash.rev':'Revenue',
  'dash.top':'Most served locations','dash.zones':'Zone Distribution',
  'mot.title':'Driver Itinerary','mot.scan':'Scan with driver\'s phone',
  'fi.drag':'Drag or click to import','fi.types':'Excel (.xlsx), CSV or TSV','fi.map':'Column mapping','fi.preview':'Import preview',
  'fi.sheet':'Spreadsheet sheet','fi.ignore':'\u2014 Ignore \u2014',
  't.added':' added!','t.removed':'Client removed','t.restored':'Route restored!','t.discarded':'Route discarded',
  't.published':'Route published to cloud!','t.synced':'Offline data synced!','t.extracted':'Data extracted!',
  't.optimized':'Optimized route generated!','t.undone':'Change undone','t.imggen':'Image generated!',
  't.imported':' clients imported successfully!','t.orderupd':'Order updated \u2014 recalculating route...',
  't.inserted':'Client inserted in route: ','t.trelloconn':'Trello connected successfully!','t.trellodisc':'Trello disconnected',
  'e.name':'Enter name','e.addr':'Enter address','e.addrinv':'Address seems invalid (include street and number)',
  'e.tag':'Select at least one tag','e.route':'Create a route first','e.baseaddr':'Departure address not found',
  'e.noaddr':'No address found','e.calc':'Error calculating route: ',
  'e.anthropic':'Configure Anthropic key','e.extract':'Extraction error. Check Anthropic key.',
  'e.credits':'Anthropic API error \u2014 check your credits!',
  'e.trello.cfg':'Configure Trello key and token in Settings',
  'e.mapname':'Map at least the Name column','e.mapaddr':'Map at least the Address column',
  'c.restore':'Restore route?','c.delete':'Delete client?','c.clearroute':'Clear route?','c.replace':'Replace current route?',
  'c.delroute':'Delete route?','c.noundo':'This action cannot be undone.',
  'c.baseaddr.title':'Departure address required',
  'c.baseaddr.msg':'To calculate arrival times, the system needs to know where the driver departs from. Go to Settings and fill in the Departure Address.',
  'cfg.trello':'Trello','cfg.trello.connected':'Trello connected',
  'cfg.trello.key':'Trello API Key','cfg.trello.token':'Trello Token',
  'cfg.trello.redirect':'You will be redirected to authorize access. No passwords are shared.',
  'cfg.trello.help':'Get it at','cfg.apiia':'AI API','cfg.anthropic':'Anthropic Key (AI extraction)','cfg.gmaps':'Google Maps Key',
  'add.trello.date':'Card date','add.trello.search':'Search cards','add.trello.found':'Cards found:',
  'add.trello.board':'1. Select board:','add.trello.list':'2. Select list:',
  'add.trello.link':'Settings','add.trello.chglist':'List','add.trello.chgboard':'Board',
  'add.img.paste':'Paste (Ctrl+V) or drag image','add.img.hint':'WhatsApp screenshot, Trello, etc.',
  'add.img.extract':'Extract with AI','add.img.data':'Client data','add.img.ai':'Filled by AI',
  'map.calc':'Calculating route...','map.gen':'Generate itinerary',
  'map.genimg.desc':'Image with all stops \u2014 easy to share on WhatsApp',
  'dash.hint':'Save routes to see client concentration',
  'modal.edit':'Edit client','modal.insert':'Add Client to Active Route',
  'modal.insert.desc':'Client will be inserted after already completed stops.',
  'modal.ambiguous':'Ambiguous address','modal.ambiguous.desc':'More than one location found. Confirm with client and select:',
  'hist.load':'Load route','hist.search':'Search route...',
  'mot.offline':'Offline','mot.updated':'Route updated','mot.buildroute':'Create a route first',
  'mot.qr':'QR Code','mot.whatsapp':'WhatsApp',
  'misc.add':'Add','misc.coletas':'pickups','misc.entregas':'deliveries',
  'zone.north':'North','zone.south':'South','zone.east':'East','zone.west':'West','zone.center':'Center',
  'stats.clients_count':'{n} clients','stats.routes_count':'{n} routes','stats.bairros_count':'{n} neighborhoods',
  'stats.coleta':'{n} pickup','stats.coletas':'{n} pickups','stats.entrega':'{n} delivery','stats.entregas':'{n} deliveries',
  'stats.summary':'{clients} clients \xb7 {coletas} pickup(s) / {entregas} delivery(ies)',
  'hist.empty':'No saved routes yet','hist.search_ph':'Search by date, name or phone...',
  'hist.load':'Load route','hist.clients_summary':'{n} clients \xb7 {col} pickup(s) / {ent} delivery(ies)',
  'hist.search_client':'Search client...','hist.route_loaded':'Route loaded!','hist.route_removed':'Route removed',
  'dash.identifying':'Identifying neighborhoods...','dash.no_bairros':'Could not identify neighborhoods.',
  'mot.stops':'Stops','mot.pickup':'Pick up','mot.deliver':'Deliver','mot.completed':'Completed',
  'mot.departure':'Departure','mot.tracking':'Tracking Mode',
  'mot.tracking_desc':'Route published \u2014 the driver is using it on mobile. You see updates in real time.',
  'mot.viewed_at':'Driver viewed at','mot.awaiting':'Waiting for driver to open the route...',
  'mot.status_coletado':'Picked up','mot.status_entregue':'Delivered','mot.status_ausente':'Absent',
  'mot.status_reagendar':'Reschedule','mot.status_reagendado':'Rescheduled','mot.status_pendente':'Pending',
  'mot.payment':'Payment','mot.pix_paid':'Pix (paid)','mot.pix_charge':'Pix (to charge)',
  'mot.card':'Card','mot.cash':'Cash','mot.no_info':'No info',
  'mot.coleta':'Pickup','mot.entrega':'Delivery','mot.concluir':'Complete','mot.editar':'Edit',
  'mot.obs_placeholder':'Note...',
  'comp.stops':'{n} stops','comp.completed':'Completed','comp.absent':'Absent',
  'comp.received':'Received','comp.to_charge':'To charge','comp.pickups':'Picked up','comp.deliveries':'Delivered',
  'share.summary':'Route Summary','share.completed':'completed','share.absent':'absent',
  'map.panel_title':'Route Panel','map.undo_tip':'Undo (Ctrl+Z)','map.beyond_limit':'Beyond deadline',
  'map.delayed':'{n} stop(s) with delay forecast','map.departure_return':'Departure / Return',
  'cep.searching':'Searching...','cep.not_found':'ZIP not found','cep.search_error':'Search error',
  'cep.detected':'ZIP detected','cep.confirmed':'ZIP confirmed','cep.valid':'Valid ZIP',
  'cep.addr_updated':'Address updated via ZIP.','cep.addr_filled':'Address filled via ZIP. Add the number.',
  'msg.optimizing':'Optimizing route (engine v2)...','msg.optimized':'Route optimized!',
  'msg.optimized_nomap':'Route optimized! (no map \u2014 Directions unavailable)',
  'msg.gen_image':'Generating image...','msg.link_copied':'Link copied!',
  'msg.client_updated':'Client updated!','msg.addr_confirmed':'Address confirmed!',
  'msg.publish_first':'Publish route to cloud first','msg.driver_update':'Driver update received',
  'msg.new_day':'New day! Previous route saved to history.','msg.new_client':'New client added:','msg.status_removed':'{name}: status removed',
  'msg.completed_client':'{name}: completed!','msg.editing':'{name}: editing...',
  'err.publish':'Error publishing:','err.connection':'Connection error:',
  'err.fill_required':'Fill in name and address','err.addr_invalid':'Invalid address (minimum 10 characters + number)',
  'err.time_order':'Start time must be before end','err.max_time':'Maximum time per stop: 240 min',
  'err.lunch_order':'Lunch break: start must be before end',
  'err.no_tags':'No tags available','err.max_tags':'Maximum 10 tags',
  'err.tag_exists':'Tag already exists','err.tag_name':'Enter tag name',
  'err.file_empty':'Empty file or no data','err.excel_read':'Error reading Excel file:',
  'err.sheet_empty':'Empty sheet','err.no_valid':'No valid data found',
  'err.no_valid_import':'No valid data to import',
  'err.select_date':'Select a date','err.no_boards':'No boards found',
  'err.fetch_boards':'Error fetching boards:','err.no_lists':'No lists in this board',
  'err.fetch_lists':'Error fetching lists','err.fetch_cards':'Error fetching cards',
  'err.configure_ai':'Configure Anthropic to import with AI','err.select_card':'Select at least one card',
  'err.configure_trello_manual':'Configure the Trello app key first (Manual setup)',
  'err.qty_neg':'Quantity cannot be negative','err.val_neg':'Value cannot be negative',
  'err.start_addr':'Configure departure address!','err.addr_not_found':'Address not found:',
  'err.gen_image':'Error generating image:','err.calc_route':'Error calculating route:',
  'confirm.restore_title':'Restore route?',
  'confirm.restore_msg':'You have a saved route with {n} client(s) from {date}. Restore it?',
  'confirm.delete_title':'Delete client?',
  'confirm.remove_client':'Remove <strong>{name}</strong> from route?',
  'confirm.clear_title':'Clear route?',
  'confirm.clear_msg':'Remove <strong>{n}</strong> client(s) from route? This action cannot be undone.',
  'confirm.replace_title':'Replace current route?',
  'confirm.replace_msg':'This will replace the {n} current clients with the history route.',
  'confirm.delete_hist_title':'Delete route?',
  'confirm.delete_hist_msg':'This action cannot be undone.',
  'confirm.base_addr_title':'Start address required',
  'confirm.base_addr_msg':'To calculate arrival times, the system needs to know where the driver starts.<br><br>Go to <strong>Settings</strong> and fill in the <strong>Start address</strong> field.',
  'confirm.remove_toast':'Remove {name} from route?',
  'card.until_noon':'Until 12pm','card.after_noon':'After 12pm','card.arrival':'Arrival:',
  'card.conflict':'{n} time conflict(s)','card.risk':'{n} pickup(s) at risk',
  'tag.created':'Tag "{name}" created!',
  // v4.7.2: Missing keys reconciliation
  'card.until':'Until',
  'cep.add_number':'Add the address number',
  'cep.updated':'ZIP code updated',
  'comp.collected':'Collected',
  'comp.delivered':'Delivered',
  'dash.bairro':'neighborhood',
  'dash.bairros':'neighborhoods',
  'dash.plural':'neighborhoods',
  'dash.rota':'route',
  'dash.rotas':'routes',
  'err.generic':'Unexpected error. Try again.',
  'err.unknown':'Unknown error',
  'hist.all':'All',
  'hist.clients':'clients',
  'mot.awaiting_driver':'Awaiting driver',
  'mot.no_payment':'No payment recorded',
  't.clients_imported':'Clients imported',
  't.lang_changed':'Language changed',
  't.pdf_generated':'PDF generated successfully',
  't.route_loaded':'Route loaded',
  't.route_removed':'Route removed',
  't.with_window':'with window',
  'tag.enter_name':'Enter tag name',
  'tag.exists':'Tag already exists',
  'tag.max_10':'Maximum 10 tags',
  'tag.none_available':'No tags available',
  'whatsapp.route':'WhatsApp Route',
  'whatsapp.summary':'WhatsApp Summary',
  // v4.7.2: Chart labels
  'mot.chart.status':'Status',
  'mot.chart.progress':'progress',
  'mot.chart.payment':'Payment',
  'mot.chart.of':'of',
  'mot.chart.values':'Values',
  'mot.chart.to_charge':'to charge',
  'mot.chart.received':'received'
}
};
function t(key,vars){const s=(_i18n[_lang]||_i18n.pt)[key]||(_i18n.pt)[key]||key;if(!vars)return s;return Object.entries(vars).reduce((r,[k,v])=>r.replace('{'+k+'}',v),s);}
function setLang(lang){_lang=lang;localStorage.setItem('rota_lang',lang);applyI18n();updateLangBtns();toast(t('t.lang_changed'),'ok');}
function updateLangBtns(){const pt=document.getElementById('lang-pt'),en=document.getElementById('lang-en');if(pt)pt.className=_lang==='pt'?'btn bp':'btn bo';if(en)en.className=_lang==='en'?'btn bp':'btn bo';}
function applyI18n(){document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');const txt=t(k);if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){el.placeholder=txt;}else if(el.tagName==='OPTION'){el.textContent=txt;}else{
  // Preserve child elements (icons etc) — only replace text nodes
  const firstChild=el.firstChild;
  if(firstChild&&firstChild.nodeType===3){firstChild.textContent=txt;}
  else if(!el.querySelector('*')){el.textContent=txt;}
  else{const textNodes=Array.from(el.childNodes).filter(n=>n.nodeType===3);if(textNodes.length){textNodes[textNodes.length-1].textContent=' '+txt;}}}});
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.getAttribute('data-i18n-ph'));});
}
// ═══════════════ END i18n ═══════════════

// ════════════════════════════════════════════════════════════
// SECTION: UTILS
// ════════════════════════════════════════════════════════════


/* ══════════════════════════════════════════════════════════════
   v4.3.3: SISTEMA DE TAGS CONFIGUR\xc1VEIS
   Usu\xe1rio pode personalizar cores e r\xf3tulos por tipo de servi\xe7o.
   Paleta de 12 cores pr\xe9-selecionadas (estilo Trello).
   ══════════════════════════════════════════════════════════════ */
// Versão do app — atualizar aqui reflete automaticamente no rodapé de Configurações
const APP_VERSION='v5.8.44';
// v5.8.25: margem de segurança nas ETAs (+20 min) — compensa ausência de trânsito em tempo real
// v5.8.28: ETA_BUFFER agora é dinâmico via cfg.etaBuffer (configurável pelo usuário, padrão 20 min)
function _getEtaBufferSec(){return((cfg&&cfg.etaBuffer!==undefined?cfg.etaBuffer:20)|0)*60;}

// v4.7.0: Safe JSON parse — protege contra localStorage corrompido
function safeJsonParse(key,defaultValue){try{const v=localStorage.getItem(key);return v?JSON.parse(v):defaultValue;}catch(e){console.warn('[STORAGE] JSON corrompido em "'+key+'":', e.message);return defaultValue;}}

const TAG_PALETTE=['#6B9E8A','#6B8DB5','#B89B7A','#9B8EC4','#C27878','#8EA86B','#6B8E9E','#B5859B','#787878','#9E8B78','#6B9E9E','#8E889E'];
const DEFAULT_TAGS=[
  {id:'coleta',label:'Coleta',color:'#6B9E8A'},
  {id:'entrega',label:'Entrega',color:'#6B8DB5'},
  {id:'devolucao',label:'Devolu\xe7\xe3o',color:'#B89B7A'},
  {id:'retirada',label:'Retirada',color:'#9B8EC4'}
];
let _tags=safeJsonParse('rota_tags',null)||DEFAULT_TAGS.map(t=>({...t}));
// v5.8.4: resolve ID real da tag por label — suporta tags com IDs customizados (ex: tag_XXXX do Trello)
function _resolveTagId(idOrLabel){if(_tags.some(t=>t.id===idOrLabel))return idOrLabel;const low=(idOrLabel||'').toLowerCase();return(_tags.find(t=>(t.label||'').toLowerCase()===low)||{id:idOrLabel}).id;}
// v5.8.5: Normaliza separadores de endereço — evita vírgulas/traços duplicados
function _normalizeAddrString(raw){
  if(!raw||raw.length<5)return raw;
  let s=raw.trim().replace(/\s{2,}/g,' ');
  s=s.replace(/\s*[-\u2013\u2014]{2,}\s*/g,' \u2014 ');  // múltiplos traços → em-dash
  s=s.replace(/,\s*[-\u2013\u2014]\s*/g,' \u2014 ');      // , - → —
  s=s.replace(/\s*[-\u2013\u2014]\s*,\s*/g,' \u2014 ');  // - , → —
  s=s.replace(/(?<!^)\s+-\s+(?!\d)/g,' \u2014 ');          // ' - ' → ' — ' (exceto número negativo)
  s=s.replace(/\s*\u2013\s*/g,' \u2014 ');                  // en-dash → em-dash
  s=s.replace(/\s*\u2014\s*/g,' \u2014 ');                  // normaliza espaços ao redor
  s=s.replace(/\u2014\s*\u2014/g,'\u2014');                 // duplo em-dash
  s=s.replace(/^[\s,\u2014]+/,'').replace(/[\s,\u2014]+$/,'');
  return s;
}
// v5.8.6: Migra endereços existentes — move complemento do final para depois do número
function _migrateAddr(addr){
  if(!addr||addr.length<5)return addr;
  const COMP_RE=/^(apto?\.?|ap\.?|apartamento|bl(?:oco?)?\.?|bloco|torre\s*\d|torre$|andar\s*\d|pav\.?\s*\d|sala\s*\d|fundos|sl\.?\s*\d|conj\.?\s*\d|kit)/i;
  // Normaliza separadores: duplo em-dash, " - " com espaços → em-dash
  let s=addr.trim().replace(/\s{2,}/g,' ')
    .replace(/\s*\u2014\s*\u2014+\s*/g,' \u2014 ')
    .replace(/\s+-\s+/g,' \u2014 ')
    .replace(/\s*\u2013\s*/g,' \u2014 ')
    .replace(/\s*\u2014\s*/g,' \u2014 ');
  // Split por em-dash
  const parts=s.split(' \u2014 ').map(p=>p.trim()).filter(Boolean);
  if(parts.length<2)return s;
  // Verifica se o ÚLTIMO bloco é um complemento
  const last=parts[parts.length-1];
  if(!COMP_RE.test(last))return s;
  // Move complemento para depois do logradouro+número
  const comp=last;
  const main=parts.slice(0,-1);
  let result=main[0]+', '+comp;
  const rest=main.slice(1).join(' \u2014 ');
  if(rest)result+=' \u2014 '+rest;
  return result;
}
function _runAddrMigration(){
  const KEY='rota_addr_migrated_v586';
  if(localStorage.getItem(KEY))return;
  let changed=0;
  clients.forEach(c=>{
    if(!c.endereco)return;
    const fixed=_migrateAddr(c.endereco);
    if(fixed!==c.endereco){c.endereco=fixed;changed++;}
  });
  if(changed){console.log('[MIGR] '+changed+' endereços normalizados');renderC();autoSaveRoute();}
  localStorage.setItem(KEY,'1');
}
// ── v5.8.7: ADDRESS CHOICE MEMORY ───────────────────────────────────────────
function _addrChoiceKey(addr,clientName){
  if(!addr)return '';
  const norm=s=>(s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();
  // v5.8.35: strip sufixo bairro/cidade (— Bairro — Cidade) antes de normalizar
  // garante que "Rua X, 10" e "Rua X, 10 — Bairro — SP" gerem a mesma chave
  const addrBase=(addr.split('\u2014')[0]||addr).trim();
  const addrKey=addrBase.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\b(apto?\.?|ap\.?|apartamento|bl(?:oco?)?\.?|bloco|torre[\s\d]*|andar[\s\d]*|sala[\s\d]*|fundos|sl\.?[\s\d]*|conj\.?[\s\d]*|kit)\b[\s\S]*/i,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();
  return clientName?norm(clientName)+'|'+addrKey:addrKey;
}
// v5.8.33: clientName opcional — tenta chave nome+endereço primeiro, fallback endereço só
function _addrChoiceGet(addr,clientName){try{const d=JSON.parse(localStorage.getItem('rota_addr_choices')||'{}');if(clientName){const r=d[_addrChoiceKey(addr,clientName)];if(r)return r;}return d[_addrChoiceKey(addr)]||null;}catch(e){return null;}}
function _addrChoiceSave(addr,choice,clientName){try{const d=JSON.parse(localStorage.getItem('rota_addr_choices')||'{}');d[_addrChoiceKey(addr,clientName)]={...choice,rawAddr:addr,chosenAt:new Date().toISOString()};localStorage.setItem('rota_addr_choices',JSON.stringify(d));}catch(e){}}
function _addrChoiceDel(key){try{const d=JSON.parse(localStorage.getItem('rota_addr_choices')||'{}');delete d[key];localStorage.setItem('rota_addr_choices',JSON.stringify(d));}catch(e){}}
function _addrChoiceGetAll(){try{return JSON.parse(localStorage.getItem('rota_addr_choices')||'{}')}catch(e){return {};}}
function _geoDistKm(a,b){const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;const aa=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(aa),Math.sqrt(1-aa));}
function _hasGeoAmbiguity(results){if(!results||results.length<2)return false;const f=results[0].geometry?results[0].geometry.location:results[0];return results.slice(1).some(r=>{const l=r.geometry?r.geometry.location:r;return _geoDistKm({lat:f.lat,lng:f.lng},{lat:l.lat,lng:l.lng})>0.5;});}

// v5.8.8: Chamada sem bounds geográficos para detectar TODOS os locais com o mesmo nome
// v5.8.10: SUBSTITUÍDO — _ambiguityCheckNoBounds era falho (Google retorna só 1 resultado)
// Nova abordagem: _checkGeoAmbiguity() compara resultado escolhido vs resultado "neutro"
// ─── mantido para compatibilidade com showAddrPicker (lazy load) ─────────────────────────
async function _ambiguityCheckNoBounds(addr){return null;}

// v5.8.8: Detecta divergência entre cidade mencionada no endereço vs cidade geocodificada
function _detectCityMismatch(client){
  if(!client.endereco||!client._cidade||client._addrPending)return false;
  const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const geocodedCity=norm(client._cidade);
  const addrNorm=norm(client.endereco);
  // Se a cidade geocodificada aparece no texto do endereço → sem mismatch
  if(addrNorm.includes(geocodedCity))return false;
  // Extrair provável cidade: última parte após o último —
  const parts=client.endereco.split('\u2014').map(p=>p.trim()).filter(Boolean);
  if(parts.length<2)return false;
  const lastPart=norm(parts[parts.length-1]);
  if(!lastPart||lastPart.length<3)return false;
  // Se a última parte (cidade declarada) não bate com a cidade geocodificada → mismatch
  const firstWordLast=lastPart.split(' ')[0];
  return !lastPart.includes(geocodedCity)&&!geocodedCity.includes(firstWordLast);
}

// v5.8.19: Corrigir endereços que foram salvos pelo pickAddr antigo sem atualizar rua/bairro
// Situação: usuário escolheu local alternativo, choice foi salvo (type:'alt'), mas endereço
// permaneceu com bairro/cidade antigo pois _fmtAddrFromGeo falhava com route vazio.
// Fix: detectar via _detectCityMismatch e aplicar a reconstrução correta de endereço.
function _fixStaleAddrChoices(){
  try{
    const savedChoices=JSON.parse(localStorage.getItem('rota_addr_choices')||'{}');
    let fixed=0;
    clients.forEach(c=>{
      if(!c.lat||!c.lng||c._addrPending)return;
      if(!_detectCityMismatch(c))return; // endereço já está correto
      const choiceKey=_addrChoiceKey(c.endereco,c.nome);
      const choiceKeyLegacy=_addrChoiceKey(c.endereco); // fallback chave legada (sem nome)
      const choice=savedChoices[choiceKey]||savedChoices[choiceKeyLegacy];
      if(!choice||choice.type!=='alt')return; // sem choice antigo — não é o caso stale
      // Aplicar mesma lógica do pickAddr v5.8.18: manter rua+número, trocar bairro/cidade
      const origStreet=(c.endereco.split('\u2014')[0]||c.endereco).trim();
      let newAddr=origStreet;
      if(choice.bairro)newAddr+=' \u2014 '+titleCase(choice.bairro);
      if(choice.cidade)newAddr+=' \u2014 '+titleCase(choice.cidade);
      delete savedChoices[choiceKey]; // remove chave antiga
      delete savedChoices[choiceKeyLegacy]; // remove chave legada se existir
      c.endereco=newAddr;
      c._cidade=choice.cidade||'';
      savedChoices[_addrChoiceKey(newAddr,c.nome)]={...choice,rawAddr:newAddr};
      fixed++;
      console.log('[v5.8.19] Endereço corrigido:',c.nome,'→',newAddr);
    });
    if(fixed){
      localStorage.setItem('rota_addr_choices',JSON.stringify(savedChoices));
      autoSaveRoute();renderC();
      console.log('[v5.8.19] '+fixed+' endereço(s) corrigido(s) automaticamente');
    }
  }catch(e){console.warn('[v5.8.19] Falha na migração de choices:',e);}
}
// v5.8.8: Migração — marcar clientes com divergência de cidade para verificação
function _runMismatchMigration(){
  const KEY='rota_mismatch_v588';
  if(localStorage.getItem(KEY))return;
  let changed=0;
  clients.forEach(c=>{
    if(!c.lat||!c.lng||c._addrPending)return;
    if(_detectCityMismatch(c)){
      c._addrPending=true;
      c._addrResults=null; // será carregado sob demanda ao abrir o picker
      console.log('[MISMATCH] '+c.nome+': endereço diz "'+c.endereco.split('\u2014').pop().trim()+'" mas geocodificado em "'+c._cidade+'"');
      changed++;
    }
  });
  if(changed){console.log('[MISMATCH] '+changed+' cliente(s) marcados para verificação');renderC();autoSaveRoute();}
  localStorage.setItem(KEY,'1');
}
// ────────────────────────────────────────────────────────────────────────────

// v5.8.10: Extrai rua + número do endereço (sem complemento, bairro ou cidade)
// "Rua São Manoel, 57, Apto 104 — Cidade São Mateus — São Paulo" → "Rua São Manoel, 57"
function _extractBaseAddr(addr){
  if(!addr||addr.length<5)return null;
  let base=addr.split('\u2014')[0].trim();
  base=base.replace(/,?\s*\b(apto?\.?|ap\.?|apartamento|bl(?:oco?)?\.?|bloco|torre[\s\d]*|andar[\s\d]*|sala\s*[\d\w]*|sl\.?\s*[\d\w]*|conj\.?\s*[\d\w]*|kit|fundos|casa\s+\d|pav\.?\s*[\d\w]*|unid\.?\s*[\d\w]*)\b.*/i,'').trim();
  const m=base.match(/^[^,]+,\s*\d+/);
  if(!m)return null;
  return m[0].trim();
}

// ── v5.8.11: REGISTRO DE LOCAIS POR RUA ─────────────────────────────────────
// Persiste em localStorage todos os locais descobertos para cada rua ambígua.
// Chave: endereço base normalizado | Valor: array de {lat,lng,bairro,cidade,display}
function _geoLocKey(baseAddr){
  return(baseAddr||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
function _geoLocGet(baseAddr){
  try{
    const d=JSON.parse(localStorage.getItem('rota_geo_locs')||'{}');
    const entry=d[_geoLocKey(baseAddr)];
    if(!entry)return null;
    // v5.8.20: suporte a {locs:[], ts:timestamp} para cachear resultado vazio (TTL 24h)
    if(entry._empty){
      const age=Date.now()-(entry.ts||0);
      return age<86400000?[]:null; // null = re-query; []= confirmed empty within 24h
    }
    return entry;
  }catch(e){return null;}
}
function _geoLocAdd(baseAddr,newLocs){
  try{
    const d=JSON.parse(localStorage.getItem('rota_geo_locs')||'{}');
    const key=_geoLocKey(baseAddr);
    if(!newLocs||!newLocs.length){
      // v5.8.20: cachear resultado vazio com timestamp para evitar re-queries infinitas
      if(!d[key]||!d[key]._empty)d[key]={_empty:true,ts:Date.now()};
      localStorage.setItem('rota_geo_locs',JSON.stringify(d));
      return;
    }
    const existing=Array.isArray(d[key])?d[key]:[];
    for(const loc of newLocs){
      if(!loc||!loc.lat||!loc.lng)continue;
      if(!existing.some(e=>_geoDistKm(e,loc)<2))existing.push({lat:loc.lat,lng:loc.lng,bairro:loc.bairro||'',cidade:loc.cidade||'',display:loc.display||''});
    }
    d[key]=existing;localStorage.setItem('rota_geo_locs',JSON.stringify(d));
  }catch(e){}
}

// v5.8.17: Busca via ViaCEP (Correios oficial) + 1 Google neutro
// ViaCEP retorna TODOS os bairros com aquele nome de rua na cidade — muito mais preciso
// que 12 queries Google biased que perdiam casos (ex: Colônia/Zona Sul).
// clientCity: cidade do cliente (ex: "São Paulo") para buscar além da âncora se diferente.
// v5.8.20: in-flight map — evita múltiplas chamadas paralelas para o mesmo endereço
const _geoLocInFlight={};
async function _findAllGeoLocations(baseAddr,clientCity){
  if(!baseAddr||!GKEY)return[];
  const cached=_geoLocGet(baseAddr);
  if(cached!==null)return cached; // null=cache miss; []=confirmed empty; [...]= results
  // v5.8.20: deduplicar chamadas concorrentes para o mesmo endereço
  const key=_geoLocKey(baseAddr);
  if(_geoLocInFlight[key])return _geoLocInFlight[key];
  let resolveFn;
  _geoLocInFlight[key]=new Promise(r=>{resolveFn=r;});
  try{
  await _resolveGeoAnchor();
  const ax=_geoAnchor?_geoAnchor.lat:-23.55;
  const ay=_geoAnchor?_geoAnchor.lng:-46.63;
  const anchorCity=_geoAnchor?.city||'';
  const anchorState=_geoAnchor?.state||'SP';
  // Extrai só tipo+nome da rua, sem número (ViaCEP não aceita número)
  const streetOnly=baseAddr.split(',')[0].trim();
  // Cidades a buscar: âncora + cidade do cliente (se diferente)
  const cities=[...new Set([anchorCity,clientCity].filter(c=>c&&c.length>1))];
  // 1. ViaCEP — fonte oficial Correios, retorna todos os logradouros com esse nome
  const viacepPromises=cities.map(city=>{
    const url='https://viacep.com.br/ws/'+encodeURIComponent(anchorState)+'/'+encodeURIComponent(city)+'/'+encodeURIComponent(streetOnly)+'/json/';
    const ac=new AbortController();setTimeout(()=>ac.abort(),7000);
    return fetch(url,{signal:ac.signal}).then(r=>r.json()).catch(()=>[]);
  });
  // 2. Google neutro (1 query sem bounds) — captura casos cross-city/cross-state
  const ac0=new AbortController();setTimeout(()=>ac0.abort(),7000);
  const googlePromise=_geocodeProxy('address='+encodeURIComponent(baseAddr+', Brasil')+'&region=br&components=country:BR',ac0.signal).catch(()=>null);
  const[viacepArrays,googleData]=await Promise.all([Promise.all(viacepPromises),googlePromise]);
  // Geocodifica cada resultado ViaCEP pelo CEP — muito mais preciso que geocoding por texto
  const allVc=viacepArrays.flat().filter(r=>r&&!r.erro&&r.cep);
  const uniqueCeps=[...new Set(allVc.map(r=>r.cep.replace('-','')))].slice(0,5); // v5.8.32: máx 5 CEPs paralelos
  const cepGeoPromises=uniqueCeps.map(cep=>{
    const ac=new AbortController();setTimeout(()=>ac.abort(),6000);
    return _geocodeProxy('address='+encodeURIComponent(cep)+',+Brasil&region=br',ac.signal).catch(()=>null).then(d=>{
        if(!d||d.status!=='OK'||!d.results.length)return null;
        const loc=_extractGeoResult(d.results[0]);
        const vc=allVc.find(r=>r.cep.replace('-','')==cep);
        if(vc){loc.bairro=vc.bairro||loc.bairro;loc.cidade=vc.localidade||loc.cidade;}
        return loc;
      });
  });
  const cepGeos=await Promise.all(cepGeoPromises);
  // Google neutro → 1 local adicional (cross-city)
  const googleLoc=googleData?.status==='OK'&&googleData.results.length?_extractGeoResult(googleData.results[0]):null;
  // Combina, filtra (≤100km da âncora) e deduplica (≥2km entre si)
  const found=[];
  for(const loc of[...cepGeos,googleLoc].filter(Boolean)){
    if(!loc?.lat||!loc?.lng)continue;
    if(_geoAnchor&&_geoDistKm({lat:loc.lat,lng:loc.lng},{lat:ax,lng:ay})>100)continue;
    if(!found.some(f=>_geoDistKm(f,loc)<2))found.push(loc);
  }
  _geoLocAdd(baseAddr,found); // v5.8.20: também cacheia resultado vazio (previne re-queries)
  console.log('[GEO-FIND] '+baseAddr+' (ViaCEP×'+cities.length+'+Google) → '+found.length+' local(is): '+found.map(f=>(f.cidade||'')+(f.bairro?'/'+f.bairro:'')).join(', '));
  delete _geoLocInFlight[key];resolveFn(found);return found;
  }catch(e){console.warn('[GEO-FIND] Erro:',e.message);delete _geoLocInFlight[key];resolveFn([]);return[];}
}

// v5.8.11: Verifica ambiguidade usando busca exaustiva.
// Retorna: array de opções para _addrResults (com isStored no chosen) | null sem ambiguidade | undefined erro
async function _checkGeoAmbiguity(chosenLat,chosenLng,chosenBairro,chosenCidade,baseAddr){
  if(!baseAddr||!GKEY)return null;
  try{
    const allLocs=await _findAllGeoLocations(baseAddr,chosenCidade);
    if(!allLocs.length)return null;
    // Verifica se há pelo menos 1 local alternativo a >3km do escolhido
    const hasAlternative=allLocs.some(loc=>_geoDistKm({lat:chosenLat,lng:chosenLng},loc)>3);
    if(!hasAlternative)return null;
    // Monta lista: chosen (isStored:true) primeiro, depois os outros ordenados por distância
    const chosen={lat:chosenLat,lng:chosenLng,bairro:chosenBairro,cidade:chosenCidade,isStored:true};
    const others=allLocs.filter(loc=>_geoDistKm({lat:chosenLat,lng:chosenLng},loc)>2)
      .sort((a,b)=>_geoDistKm({lat:chosenLat,lng:chosenLng},a)-_geoDistKm({lat:chosenLat,lng:chosenLng},b));
    console.log('[GEO-AMB] '+baseAddr+': '+chosenCidade+' vs ['+others.map(o=>o.cidade).join(', ')+']');
    return[chosen,...others];
  }catch(e){console.warn('[GEO-AMB]',e.message);return undefined;}
}

// v5.8.11: Auditoria de clientes já geocodificados — sessionStorage (1x por sessão de browser)
async function _runStoredGeoAudit(){
  if(!clients.length)return;
  const SESSION_KEY='rota_geo_audit_session';
  let audited=new Set();
  try{audited=new Set(JSON.parse(sessionStorage.getItem(SESSION_KEY)||'[]'));}catch(e){}
  // v5.8.34: pula se type:'alt' (escolheu local diferente) OU type:'confirmed' (confirmou atual)
  const toCheck=clients.filter(c=>c.lat&&c.lng&&!c._addrPending&&!audited.has(String(c.id))&&!['alt','confirmed'].includes((_addrChoiceGet(c.endereco,c.nome)||{}).type));
  if(!toCheck.length)return;
  console.log('[GEO-AUDIT] Verificando '+toCheck.length+' cliente(s)...');
  let anyFound=false;
  for(const c of toCheck){
    const baseAddr=_extractBaseAddr(c.endereco);
    if(!baseAddr){audited.add(String(c.id));continue;}
    const parts=c.endereco.split('\u2014').map(p=>p.trim()).filter(Boolean);
    const storedBairro=parts.length>=3?parts[parts.length-2]:(parts.length===2?'':'');
    const storedCidade=parts.length>=2?parts[parts.length-1]:(c._cidade||'');
    const result=await _checkGeoAmbiguity(c.lat,c.lng,storedBairro,storedCidade,baseAddr);
    if(result===undefined){
      console.warn('[GEO-AUDIT] Falha de rede para '+c.nome+' — tentará na próxima sessão');
    }else{
      audited.add(String(c.id));
      if(result){c._addrPending=true;c._addrResults=result;anyFound=true;}
    }
    // Sem delay extra — _findAllGeoLocations já usa cache após primeira busca
  }
  try{sessionStorage.setItem(SESSION_KEY,JSON.stringify([...audited]));}catch(e){}
  if(anyFound){renderC();autoSaveRoute();}
}
// ────────────────────────────────────────────────────────────────────────────

// v5.8.5: Extrai complemento embutido no endereço (Apto X, Bloco Y, etc.)
function _extractCompFromAddr(addr){
  if(!addr)return '';
  const m=addr.match(/\b((?:apto?\.?|ap\.?|apartamento|bl(?:oco?)?\.?|bloco|casa\s+\d|sala\s*\d*|sl\.?|conj(?:unto)?\.?|loja|torre\s*\d*|andar|pav\.?|fundos|unid\.?)\s*[\w\d\/\-]*)\b/i);
  return m?m[1].trim():'';
}
// v5.8.5: Remonta endereço a partir dos componentes do Google Geocoding
function _fmtAddrFromGeo(geoResult,origAddr){
  if(!geoResult||!geoResult.route)return origAddr;
  const comp=_extractCompFromAddr(origAddr);
  let s=titleCase(geoResult.route);
  if(geoResult.streetNum)s+=', '+geoResult.streetNum;
  if(comp)s+=', '+comp;
  if(geoResult.bairro)s+=' \u2014 '+titleCase(geoResult.bairro);
  if(geoResult.cidade)s+=' \u2014 '+titleCase(geoResult.cidade);
  return s;
}
function _saveTags(){localStorage.setItem('rota_tags',JSON.stringify(_tags));}
// v5.4.3: Reavaliar tags em todos os cartões já na rota ao criar/renomear tag
function _reapplyTagsToClients(){
  if(!clients||!clients.length)return;
  const _norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let changed=0;
  clients.forEach(c=>{
    const texto=_norm((c.nome||'')+' '+(c.obs||''));
    const matched=_tags.filter(tag=>{
      const lbl=_norm(tag.label);
      return lbl&&new RegExp('\\b'+lbl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(texto);
    }).map(tag=>tag.id);
    const validIds=new Set(_tags.map(t=>t.id));
    const raw=Array.isArray(c.tipo)?c.tipo:[c.tipo].filter(Boolean);
    const atual=raw.filter(v=>validIds.has(v));
    if(!matched.length&&atual.length===raw.length)return;
    const merged=[...new Set([...atual,...matched])];
    if(merged.length!==atual.length||merged.some((v,i)=>v!==atual[i])){c.tipo=merged;changed++;}
  });
  if(changed)toast(changed+' cartão(ões) atualizado(s) com nova tag','ok');
}
function _getTagColor(tipo){if(!tipo)return 'rgba(108,92,231,.18)';const t=_tags.find(t=>t.id===tipo);return t?t.color:'rgba(108,92,231,.18)';}
function _getTagLabel(tipo){if(!tipo)return '';const t=_tags.find(t=>t.id===tipo);return t?t.label:'';}
function normalizeTipo(t){return Array.isArray(t)?t:t?[t]:[];}
function _getTagById(id){return _tags.find(t=>t.id===id);}
function _getActiveTagIds(){return _tags.map(t=>t.id);}

// v4.3.5: Helper functions for multi-tag rendering
function renderTagBorder(tipos){
  if(!tipos||!tipos.length)return '<div style="position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:12px 0 0 12px;background:rgba(108,92,231,.12)"></div>';
  const stripes=tipos.map(t=>'<div style="width:3px;background:'+_getTagColor(t)+'"></div>').join('');
  return '<div style="position:absolute;left:0;top:0;bottom:0;display:flex;border-radius:12px 0 0 12px;overflow:hidden">'+stripes+'</div>';
}
function tagBorderWidth(tipos){return Math.max(1,tipos?tipos.length:0)*3;}
function renderTagChips(tipos){
  if(!tipos||!tipos.length)return '';
  return tipos.map(t=>{
    const color=_getTagColor(t);
    const label=_getTagLabel(t);
    return '<span style="font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:2px 7px;border-radius:20px;line-height:1.6;background:'+color+'18;color:'+color+'">'+label+'</span>';
  }).join('');
}

// v4.3.5: Multi-select tag state for forms
let _formTags={};
function initTagMultiSelect(id,selected){
  _formTags[id]=selected||[];
  renderTagMultiSelect(id);
}
function renderTagMultiSelect(id){
  const wrap=g(id);if(!wrap)return;
  wrap.style.position='relative';
  // v4.4.0: Entire box clickable to open dropdown
  wrap.onclick=function(e){if(!e.target.closest('.tag-ms-x')&&!e.target.closest('.tag-dropdown')&&!e.target.closest('.tag-dd-item'))togTagDD(id);};
  const sel=_formTags[id]||[];
  let html='';
  sel.forEach(tid=>{
    const color=_getTagColor(tid);const label=_getTagLabel(tid);
    if(label)html+='<span class="tag-ms-chip" style="background:'+color+'18;color:'+color+'">'+label+' <span class="tag-ms-x" onclick="event.stopPropagation();rmFormTag(\''+id+'\',\''+tid+'\')">×</span></span>';
  });
  html+='<span class="tag-ms-add">Adicionar</span>';
  const avail=_tags.filter(t=>!sel.includes(t.id));
  html+='<div class="tag-dropdown" id="'+id+'-dd" style="display:none">';
  avail.forEach(t=>{
    html+='<div class="tag-dd-item" style="border-left:3px solid '+t.color+'" onclick="event.stopPropagation();addFormTag(\''+id+'\',\''+t.id+'\')"><span style="width:10px;height:10px;border-radius:4px;background:'+t.color+';flex-shrink:0"></span> '+t.label+'</div>';
  });
  if(!avail.length)html+='<div style="padding:8px 10px;font-size:11px;color:var(--mu)">Todas as tags atribu\xeddas</div>';
  // v4.3.9: Inline tag creation
  html+='<div style="border-top:1px solid var(--bd);padding:8px 10px">'
    +'<div class="tag-inline-create" id="'+id+'-create" style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--pu);font-weight:600" onclick="event.stopPropagation();showInlineTagCreate(\''+id+'\')">'
    +'<span style="font-size:14px;line-height:1">+</span> Criar nova tag'
    +'</div>'
    +'<div id="'+id+'-create-form" style="display:none" onclick="event.stopPropagation()">'
    +'<input type="text" id="'+id+'-new-name" placeholder="Nome da tag" style="width:100%;padding:6px 8px;border:1.5px solid var(--bd);border-radius:8px;font-size:12px;font-family:inherit;margin-bottom:6px;background:var(--sf);color:var(--tx);box-sizing:border-box" onkeydown="if(event.key===\'Enter\'){event.preventDefault();confirmInlineTag(\''+id+'\')}">'
    +'<div id="'+id+'-color-pick" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px"></div>'
    +'<button class="btn bp bsm" style="width:100%;justify-content:center;padding:5px 8px;font-size:11px" onclick="event.stopPropagation();confirmInlineTag(\''+id+'\')">Adicionar</button>'
    +'</div>'
  +'</div>';
  html+='</div>';
  wrap.innerHTML=html;
}
function addFormTag(id,tid){_formTags[id]=_formTags[id]||[];if(!_formTags[id].includes(tid))_formTags[id].push(tid);renderTagMultiSelect(id);const _dd=g(id+'-dd');if(_dd)_dd.style.display='none';} // v5.8.39: null guard — dropdown pode não existir no DOM ainda
function rmFormTag(id,tid){_formTags[id]=(_formTags[id]||[]).filter(t=>t!==tid);renderTagMultiSelect(id);}
function togTagDD(id){const dd=g(id+'-dd');dd.style.display=dd.style.display==='none'?'block':'none';}
function getFormTags(id){return _formTags[id]||[];}

// v4.3.9: Inline tag creation from within any form dropdown
let _inlineTagColor=null;
function showInlineTagCreate(id){
  const createBtn=g(id+'-create');
  const form=g(id+'-create-form');
  if(!createBtn||!form)return;
  createBtn.style.display='none';
  form.style.display='block';
  // Auto-select next available color
  const usedColors=_tags.map(t=>t.color);
  const availColor=TAG_PALETTE.find(c=>!usedColors.includes(c))||TAG_PALETTE[_tags.length%TAG_PALETTE.length];
  _inlineTagColor=availColor;
  // Render color picker
  const pick=g(id+'-color-pick');
  if(pick){
    pick.innerHTML=TAG_PALETTE.map(c=>
      '<span style="width:22px;height:22px;border-radius:6px;background:'+c+';cursor:pointer;border:2px solid '+(c===availColor?'#1e1b4b':'transparent')+';transition:all .12s;display:inline-block" onclick="event.stopPropagation();selectInlineColor(\''+id+'\',\''+c+'\',this)"></span>'
    ).join('');
  }
  // Focus the input
  setTimeout(()=>{const inp=g(id+'-new-name');if(inp)inp.focus();},50);
}
function selectInlineColor(id,color,el){
  _inlineTagColor=color;
  const pick=g(id+'-color-pick');
  if(pick){
    pick.querySelectorAll('span').forEach(s=>{
      s.style.border='2px solid '+(s.style.background===el.style.background?'#1e1b4b':'transparent');
    });
  }
}
function confirmInlineTag(id){
  const nameInput=g(id+'-new-name');
  const raw=(nameInput?.value||'').trim();const name=raw.charAt(0).toUpperCase()+raw.slice(1);
  if(!name){toast(t('tag.enter_name'),'warn');return;}
  if(_tags.length>=10){toast(t('tag.max_10'),'warn');return;}
  // Check duplicate
  if(_tags.some(t=>t.label.toLowerCase()===name.toLowerCase())){
    toast(t('tag.exists'),'warn');return;
  }
  _lastLocalChange=Date.now();_tagsUpdatedAt=Date.now();
  const newId='tag_'+Date.now();
  const color=_inlineTagColor||TAG_PALETTE[_tags.length%TAG_PALETTE.length];
  _tags.push({id:newId,label:name,color});
  _saveTags();
  // Add the new tag to current form selection
  addFormTag(id,newId);
  // Update tag config UI if visible
  if(typeof renderTagsConfig==='function')renderTagsConfig();
  if(typeof updateTagSelects==='function')updateTagSelects();
  toast(name+t('tag.created'),'ok');
}


// ════════════════════════════════════════════════════════════
// SECTION: CEP / GEOCODING
// ════════════════════════════════════════════════════════════

// v5.8.25: monta endereço completo a partir dos campos separados logradouro/número/complemento
function buildFullAddr(prefix){
  const logr=(document.getElementById(prefix+'-end')?.value||'').trim();
  const num=(document.getElementById(prefix+'-num')?.value||'').trim();
  const comp=(document.getElementById(prefix+'-comp')?.value||'').trim();
  let a=logr;
  // v5.8.39: evita duplicar número quando logradouro já contém o mesmo número
  // ex: "Rua Flores, 407" + num="407" → NÃO append ", 407" de novo
  if(num){
    const logrHasNum=new RegExp('(^|,\\s*|\\s)'+num.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(\\s*,|\\s*$|\\s)').test(logr+' ');
    if(!logrHasNum)a+=', '+num;
  }
  if(comp)a+=', '+comp;
  return a;
}
// v5.8.25: extrai logradouro, número e complemento de uma string de endereço existente
function _parseAddrParts(endereco){
  // v5.8.29: busca o número em qualquer token (não só tokens[1])
  // Suporta: "Rua Foo, Bairro Bar, 123, Apto 4" → logr="Rua Foo, Bairro Bar", num="123", comp="Apto 4"
  // v5.8.29b: token é número apenas se começa com dígito E não tem espaços
  // (evita capturar nomes de rua como "9 de Julho", "15 de Novembro" como número)
  const mainPart=(endereco.split('\u2014')[0]||endereco).trim().replace(/,\s*$/,'');
  const tokens=mainPart.split(/,\s*/);
  let numIdx=-1;
  for(let i=0;i<tokens.length;i++){
    const tk=(tokens[i]||'').trim();
    if(/^\d/.test(tk)&&!/\s/.test(tk)){numIdx=i;break;}
  }
  if(numIdx<0)return{logr:mainPart,num:'',comp:''};
  const logr=tokens.slice(0,numIdx).join(', ');
  const num=tokens[numIdx].trim();
  const comp=tokens.slice(numIdx+1).join(', ').trim();
  return{logr,num,comp};
}

/* ══════════════════════════════════════════════════════════════
   v4.3.9: CEP ↔ ENDEREÇO BIDIRECIONAL (ViaCEP)
   Campo CEP separado. CEP preenche endereço, endereço preenche CEP.
   Funciona em todos os formulários (principal, edição, smart insert).
   Prefixos: 'f' (main), 'em' (edit modal), 'si' (smart insert)
   ══════════════════════════════════════════════════════════════ */
let _cepCache={};
let _cepTimeout=null;
let _endTimeout=null;
let _cepFilling=false; // guard against infinite loops

// Format CEP as NNNNN-NNN
function fmtCep(v){
  const d=v.replace(/\D/g,'');
  if(d.length<=5)return d;
  return d.slice(0,5)+'-'+d.slice(5,8);
}

// CEP field input handler
function onCepInput(prefix){
  const cepEl=g(prefix+'-cep');
  if(!cepEl)return;
  // Auto-format
  const raw=cepEl.value.replace(/\D/g,'');
  cepEl.value=fmtCep(cepEl.value);
  const statusEl=g(prefix+'-cep-status');
  if(raw.length<8){
    if(statusEl)statusEl.innerHTML='';
    return;
  }
  if(raw.length===8){
    clearTimeout(_cepTimeout);
    _cepTimeout=setTimeout(()=>fetchCepAndFill(raw,prefix),300);
  }
}

// Fetch CEP and fill address field
async function fetchCepAndFill(cep,prefix){
  const statusEl=g(prefix+'-cep-status');
  const endEl=g(prefix+'-end');
  // Check cache
  if(_cepCache[cep]){
    applyCepToAddress(_cepCache[cep],endEl,statusEl,prefix);
    return;
  }
  if(statusEl){statusEl.className='cep-status loading';statusEl.innerHTML='<span class="spin"></span> Buscando...';}
  try{
    const res=await fetch('https://viacep.com.br/ws/'+cep+'/json/');
    const data=await res.json();
    if(data.erro){
      if(statusEl){statusEl.className='cep-status err';statusEl.textContent='CEP n\u00e3o encontrado';}
      setTimeout(()=>{if(statusEl)statusEl.innerHTML='';},3000);
      return;
    }
    _cepCache[cep]=data;
    applyCepToAddress(data,endEl,statusEl,prefix);
  }catch(e){
    if(statusEl){statusEl.className='cep-status err';statusEl.textContent='Erro na busca';}
    setTimeout(()=>{if(statusEl)statusEl.innerHTML='';},3000);
  }
}

function applyCepToAddress(data,endEl,statusEl,prefix){
  // v5.8.25: preenche APENAS o campo logradouro — número e complemento são campos separados e não são tocados
  if(data.logradouro&&endEl){
    _cepFilling=true;
    endEl.value=data.logradouro;
    endEl.dispatchEvent(new Event('input',{bubbles:true}));
    _cepFilling=false;
    // Flash verde no logradouro
    endEl.classList.remove('cep-flash');void endEl.offsetWidth;endEl.classList.add('cep-flash');
    // Focar no campo número se ainda estiver vazio
    const numEl=document.getElementById(prefix+'-num');
    if(numEl&&!numEl.value.trim()){setTimeout(()=>{numEl.focus();},80);}
  }
  if(statusEl){
    // v5.8.25: formato padrão com em-dash — Logradouro — Bairro — Cidade
    const parts=[data.logradouro,data.bairro,data.localidade].filter(Boolean);
    statusEl.className='cep-status ok';
    statusEl.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> '+parts.join(' \u2014 ');
    setTimeout(()=>{if(statusEl)statusEl.innerHTML='';},5000);
  }
  toast(t('cep.add_number'),'ok');
}

// Address field input handler: try to extract CEP from typed text
function onEndInput(prefix){
  const el=document.getElementById(prefix+'-end');if(!el)return;
  // v5.8.26: no modal de edição, limpar CEP ao trocar logradouro para forçar re-geocodificação
  if(prefix==='em'&&!_cepFilling){
    const cepEl=document.getElementById('em-cep');
    if(cepEl)cepEl.value='';
  }
  const val=el.value;
  // Extract CEP pattern from typed text
  const cepMatch=val.match(/(\d{5})-?(\d{3})/);
  if(cepMatch){
    const cep=cepMatch[1]+cepMatch[2];
    const cepEl=document.getElementById(prefix+'-cep');
    if(cepEl&&!cepEl.value.replace(/\D/g,'')){
      cepEl.value=fmtCep(cep);
      const statusEl=document.getElementById(prefix+'-cep-status');
      fetchCepValidate(cep,statusEl);
    }
  }
  // v4.4.0: Schedule geocoding for Address→CEP on all prefixes
  if(prefix==='f'){schedGeo();}
  else if(val.length>=10){
    clearTimeout(window['_geoT_'+prefix]);
    window['_geoT_'+prefix]=setTimeout(()=>geocodeCepForPrefix(prefix),2500); // v5.8.32: 1400→2500ms
  }
}
// v4.4.0: Geocode address to extract CEP for edit modal and smart insert
const _geoCepLastAddr={}; // v5.8.32: evita re-geocodificar mesmo endereço
async function geocodeCepForPrefix(prefix){
  const addr=buildFullAddr(prefix);if(!addr||addr.length<8)return;
  if(_geoCepLastAddr[prefix]===addr)return; // v5.8.32: mesmo endereço, skip
  _geoCepLastAddr[prefix]=addr;
  try{
    const suffix=_getAddrSuffix?_getAddrSuffix():'';
    const bounds=_getAnchorBounds?_getAnchorBounds():'';
    const comps=_getAnchorComponents?_getAnchorComponents():'';
    const d=await _geocodeProxy('address='+encodeURIComponent(addr+suffix)+'&region=br'+bounds+comps);
    if(d&&d.status==='OK'&&d.results.length){
      const pc=d.results[0].address_components?.find(c=>c.types.includes('postal_code'));
      if(pc){
        const cepEl=document.getElementById(prefix+'-cep');
        // v5.8.26: em modo edição ('em') sempre atualizar CEP; nos demais, só se vazio
        if(cepEl&&(prefix==='em'||!cepEl.value.replace(/\D/g,''))){
          cepEl.value=fmtCep(pc.long_name.replace(/\D/g,''));
          const statusEl=document.getElementById(prefix+'-cep-status');
          if(statusEl){statusEl.className='cep-status ok';statusEl.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> CEP detectado';setTimeout(()=>{statusEl.innerHTML='';},3000);}
        }
      }
      // v4.4.0 Obs 5c: Auto-complete bairro from geocoding
      const bairroComp=d.results[0].address_components?.find(c=>c.types.includes('sublocality')||c.types.includes('sublocality_level_1'));
      if(bairroComp){
        const endEl=document.getElementById(prefix+'-end');
        if(endEl&&!endEl.value.toLowerCase().includes(bairroComp.long_name.toLowerCase())){
          // Bairro not in address yet — append it
          endEl.value=endEl.value.replace(/,?\s*$/,'')+', '+bairroComp.long_name;
        }
      }
    }
  }catch(e){}
}

// Validate CEP extracted from address (don't overwrite address)
async function fetchCepValidate(cep,statusEl){
  if(_cepCache[cep]){
    if(statusEl){
      const d=_cepCache[cep];
      statusEl.className='cep-status ok';
      statusEl.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> CEP v\u00e1lido';
      setTimeout(()=>{if(statusEl)statusEl.innerHTML='';},3000);
    }
    return;
  }
  try{
    const res=await fetch('https://viacep.com.br/ws/'+cep+'/json/');
    const data=await res.json();
    if(!data.erro){
      _cepCache[cep]=data;
      if(statusEl){
        statusEl.className='cep-status ok';
        statusEl.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> CEP v\u00e1lido';
        setTimeout(()=>{if(statusEl)statusEl.innerHTML='';},3000);
      }
    }
  }catch(e){}
}

// Legacy compatibility: detectCEP redirects to new system
function detectCEP(input){onCepInput(input.id.split('-')[0]);}


// ══════════════════════════════════════════════════════════════
// v4.3.9: UX ENHANCEMENTS
// ══════════════════════════════════════════════════════════════

// [5] AUTO TITLE CASE — Nome, Endereço, Observações
const _TC_LOWER=new Set(['de','do','da','dos','das','e','em','no','na','nos','nas','ao','aos','com','por','para','pelo','pela','um','uma','que','se']);
function titleCase(str){
  return str.replace(/\S+/g,(word,idx)=>{
    if(idx>0&&_TC_LOWER.has(word.toLowerCase()))return word.toLowerCase();
    const fi=word.search(/[a-zA-ZáàâãéèêíóôõúüçÁÀÂÃÉÈÊÍÓÔÕÚÜÇ]/);
    if(fi<0)return word;
    // v5.8.39: preserva siglas ALL-CAPS (2-4 letras: SP, XV, CEP, APTO, etc.)
    const letters=word.slice(fi).replace(/[^a-zA-Z]/g,'');
    if(letters.length>=2&&letters.length<=4&&letters===letters.toUpperCase()&&/^[A-Z]+$/.test(letters))return word;
    return word.slice(0,fi)+word.charAt(fi).toUpperCase()+word.slice(fi+1).toLowerCase();
  });
}
function onTitleCaseBlur(e){
  const v=e.target.value.trim();
  if(v)e.target.value=titleCase(v);
}
// Apply to all name, address, obs fields
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    ['f-nome','em-nome','si-nome','f-end','em-end','si-end','f-num','em-num','si-num','f-comp','em-comp','si-comp','f-obs','em-obs','si-obs'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.addEventListener('blur',onTitleCaseBlur);
    });
  },500);
});

// [6] ENTER PARA SALVAR FORMULÁRIO
document.addEventListener('keydown',(e)=>{
  if(e.key!=='Enter')return;
  if(e.target.tagName==='TEXTAREA')return; // textarea: quebra de linha normal
  if(e.target.closest('.csel-dropdown'))return; // dentro de dropdown custom
  // Formulário principal
  if(e.target.closest('#cform')){e.preventDefault();addClient();return;}
  // Modal edição
  if(e.target.closest('#edit-modal')){e.preventDefault();saveEditC();closeModal('edit-modal');return;}
  // Smart Insert
  if(e.target.closest('#smart-insert-modal')){e.preventDefault();doSmartInsert();return;}
});

// [7] MÁSCARA TELEFONE (XX) XXXXX-XXXX
function fmtTel(v){
  const d=v.replace(/\D/g,'').slice(0,11);
  if(d.length<=2)return d;
  if(d.length<=7)return '('+d.slice(0,2)+') '+d.slice(2);
  return '('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7);
}
function onTelInput(e){
  const pos=e.target.selectionStart;
  const before=e.target.value;
  e.target.value=fmtTel(e.target.value);
  // Adjust cursor
  const diff=e.target.value.length-before.length;
  e.target.setSelectionRange(pos+diff,pos+diff);
}
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    ['f-tel','em-tel','si-tel'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.addEventListener('input',onTelInput);
    });
  },500);
});

// [8] VALIDAÇÃO VISUAL — borda vermelha + shake + mensagem inline (v5.8.44)
function shakeField(id,msg){
  const el=document.getElementById(id);if(!el)return;
  el.classList.add('field-error');
  if(msg){
    let em=document.getElementById(id+'-errmsg');
    if(!em){em=document.createElement('div');em.id=id+'-errmsg';em.className='field-inline-err';el.parentNode.insertBefore(em,el.nextSibling);}
    em.textContent=msg;em.style.display='block';
  }
  el.addEventListener('input',function rem(){
    el.classList.remove('field-error');
    const em=document.getElementById(id+'-errmsg');if(em)em.style.display='none';
    el.removeEventListener('input',rem);
  },{once:true});
}

// [9] CONTADOR DE CARACTERES — Observações
const OBS_MAX=200;
function initObsCounters(){
  ['f-obs','em-obs','si-obs'].forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    if(el.dataset.counterInit)return;
    el.dataset.counterInit='1';
    el.maxLength=OBS_MAX;
    const counter=document.createElement('div');
    counter.className='obs-counter';
    counter.id=id+'-counter';
    counter.textContent='0/'+OBS_MAX;
    el.parentNode.style.position='relative';
    el.parentNode.appendChild(counter);
    el.addEventListener('input',()=>{
      counter.textContent=el.value.length+'/'+OBS_MAX;
      counter.classList.toggle('near-limit',el.value.length>OBS_MAX*0.8);
    });
  });
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(initObsCounters,600));

// [11] BIDIRECIONAL: Endereço → CEP via Google Geocoding
// Quando schedGeo resolve o endereço, extrair postal_code e preencher campo CEP
const _origCheckAmb=typeof checkAmb==='function'?checkAmb:null;
async function checkAmbWithCep(){
  const addr=v('f-end');if(addr.length<8)return;
  try{
    const d=await _geocodeProxy('address='+encodeURIComponent(addr+_getAddrSuffix())+'&region=br'+_getAnchorBounds()+_getAnchorComponents());
    if(d&&d.status==='OK'&&d.results.length){
      // Extrair CEP do resultado
      const comps=d.results[0].address_components||[];
      const pcComp=comps.find(c=>c.types.includes('postal_code'));
      if(pcComp){
        const cepEl=document.getElementById('f-cep');
        if(cepEl&&!cepEl.value.replace(/\D/g,'')){
          // v4.4.0: Se endereço é ambíguo (múltiplos resultados), alertar antes de preencher
          if(d.results.length>1){
            const ambAlert=document.getElementById('amb-cep-alert');
            if(ambAlert)ambAlert.remove();
            const alertDiv=document.createElement('div');
            alertDiv.id='amb-cep-alert';
            alertDiv.className='cep-amb-alert';
            alertDiv.innerHTML='<span class="mot-ico" style="flex-shrink:0;margin-top:1px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>'
              +'<div>Endereço ambíguo detectado. CEP sugerido: <strong>'+fmtCep(pcComp.long_name.replace(/\D/g,''))+'</strong>. Confirme o bairro ou CEP antes de prosseguir.</div>'
              +'<button onclick="document.getElementById(\'f-cep\').value=\''+fmtCep(pcComp.long_name.replace(/\D/g,''))+'\';this.closest(\'.cep-amb-alert\').remove();toast(\'CEP confirmado\',\'ok\')">Confirmar</button>';
            const ambBox=document.getElementById('amb-box');
            if(ambBox)ambBox.parentNode.insertBefore(alertDiv,ambBox);
          } else {
            cepEl.value=fmtCep(pcComp.long_name.replace(/\D/g,''));
            const statusEl=document.getElementById('f-cep-status');
            if(statusEl){
              statusEl.className='cep-status ok';
              statusEl.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> CEP detectado';
              setTimeout(()=>{statusEl.innerHTML='';},3000);
            }
          }
        }
      }
      // v5.8.7: Lógica de ambiguidade com memória
      const addr2=v('f-end');
      if(d.results.length>1&&_hasGeoAmbiguity(d.results)){
        const mem=_addrChoiceGet(addr2);
        if(mem){
          // Memória encontrada — aplicar silenciosamente
          ambRes=[{...mem,display_name:mem.rawAddr||addr2}];ambSel=0;
          g('amb-box').style.display='none';
          toast('\u2713 Endere\xE7o confirmado automaticamente ('+[mem.bairro,mem.cidade].filter(Boolean).join(', ')+')','ok');
        } else {
          // Sem memória — mostrar picker enriquecido (bairro + cidade)
          ambRes=d.results.map(r=>_extractGeoResult(r));
          const box=g('amb-box');
          const SVG_WARN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
          let html='<div class="ab w"><span class="mot-ico">'+SVG_WARN+'</span> <strong>Endere\xE7o amb\xEDguo</strong> \u2014 '+d.results.length+' locais encontrados. Selecione o correto:</div>';
          ambRes.forEach((r,i)=>{
            const loc=[r.bairro,r.cidade].filter(Boolean).join(' \u2014 ')||r.display;
            html+='<div class="ao" id="ao-'+i+'" onclick="selAmb('+i+')"><strong style="font-size:13px">'+loc+'</strong><div style="font-size:11px;color:var(--mu);margin-top:2px">'+r.display+'</div></div>';
          });
          box.innerHTML=html;box.style.display='block';
        }
      } else {g('amb-box').style.display='none';}
    }
  }catch(e){g('amb-box').style.display='none';}
}

/* ══════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
// SECTION: CLOUD SYNC
// ════════════════════════════════════════════════════════════

   CLOUD SYNC — Cloudflare Worker + KV
   ══════════════════════════════════════════════════════════════ */
const WORKER_URL='https://roteiro-lavanderia.nigel-guandalini.workers.dev';
/// v5.8.38: Rate limiter global — máximo 30 chamadas Geocoding por 60s (era 15)
const _GEO_RATE_MAX=30;
let _geoRateLog=[];
// v5.8.38: BUG-01 — guard de tentativas por endereço (evita loop infinito)
const _geoFailCount={}; // addr → nº de falhas consecutivas na sessão
const _GEO_MAX_FAILS=3; // após 3 falhas, abandona o endereço na sessão
function _geoRateOk(){
  const now=Date.now();
  _geoRateLog=_geoRateLog.filter(t=>now-t<60000);
  if(_geoRateLog.length>=_GEO_RATE_MAX){console.warn('[GEO] Rate limit atingido ('+_GEO_RATE_MAX+'/min) — chamada bloqueada');return false;}
  _geoRateLog.push(now);return true;
}
function _geoFailOk(addr){
  if(!addr)return true;
  const k=addr.slice(0,60); // normaliza chave
  if((_geoFailCount[k]||0)>=_GEO_MAX_FAILS){return false;}
  return true;
}
function _geoFailInc(addr){
  if(!addr)return;
  const k=addr.slice(0,60);
  _geoFailCount[k]=(_geoFailCount[k]||0)+1;
  if(_geoFailCount[k]>=_GEO_MAX_FAILS)console.warn('[GEO] '+k+' atingiu '+_GEO_MAX_FAILS+' falhas — endereço suspenso na sessão');
}
function _geoFailReset(addr){
  if(!addr)return;
  delete _geoFailCount[addr.slice(0,60)];
}
// v5.8.21: Plano B — Geocoding Proxy via Worker (cache KV compartilhado, chave server-side)
// Substitui todas as chamadas diretas à Google Geocoding API no cliente.
// queryStr: params sem key= (ex: 'address=Rua+X&region=br')
async function _geocodeProxy(queryStr,signal){
  if(!_geoRateOk())return{status:'RATE_LIMITED',results:[]}; // v5.8.32: rate limit
  const opts={};if(signal)opts.signal=signal;
  try{
    const r=await fetch(WORKER_URL+'/api/geocode?'+queryStr,opts);
    return r.json();
  }catch(e){return{status:'ERROR',results:[]};}
}
let _currentRouteId=null;
let _cloudVersion=0;
let _cloudHash='';
let _motoristaViewedAt=null; // v4.3.2: timestamp de quando motorista abriu a rota
let _pollTimer=null;

function generateRouteId(){
  const d=new Date().toISOString().split('T')[0];
  const r=Math.random().toString(36).substring(2,8);
  return d+'-'+r;
}

function setCloudStatus(state,msg){
  const el=document.getElementById('cloud-status');
  const dot=document.getElementById('cloud-dot');
  const msgEl=document.getElementById('cloud-msg');
  if(!el)return;
  el.style.display='flex';
  dot.className='cloud-dot '+state;
  msgEl.textContent=msg||state;
}

async function cloudPublish(){
  if(!clients.length||!order.length){toast(t('e.route'),'err');return;}
  const btn=document.getElementById('publish-btn');
  if(btn)btn.disabled=true;
  try{
    if(!_currentRouteId)_currentRouteId=generateRouteId();
    const body={
      routeId:_currentRouteId,
      clients:JSON.parse(JSON.stringify(clients)),
      order:[...order],
      cfg:{base:cfg.base,retaddr:cfg.retaddr,saida:cfg.saida,ret:cfg.ret,tempo:cfg.tempo},
      date:clients[0]?.data||new Date().toISOString().split('T')[0]
    };
    const res=await fetch(WORKER_URL+'/api/route/publish',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const data=await res.json();
    if(data.ok){
      _cloudVersion=data.version;
      _cloudHash=data.hash;
      if(data.routeId)_currentRouteId=data.routeId; // v5.8.38: garante routeId do servidor
      autoSaveRoute(); // v5.8.38: BUG-03 — persiste routeId no localStorage imediatamente
      toast(t('t.published'),'ok');
      setCloudStatus('synced','Rota online e sincronizada em tempo real');
      _syncPushDebounced();
      return true; // v5.8.44: sinaliza sucesso para o hook
    } else {
      // v5.8.38: BUG-05 — KV write limit → mensagem específica + fallback local
      // v5.8.44: res.status===500 também indica KV limit (HTTP level)
      const isKvLimit=!res.ok||(data.error&&(data.error.includes('KV')||data.error.includes('limit')||data.error.includes('quota')));
      if(isKvLimit){
        toast('Limite do serviço cloud atingido. Rota salva localmente — link do motorista indisponível agora.','warn');
        setCloudStatus('offline','Limite do serviço atingido');
        autoSaveRoute(); // garante que rota está salva localmente
      } else {
        toast(t('err.publish')+(data.error||t('err.unknown')),'err');
      }
      return false; // v5.8.44: sinaliza falha para o hook
    }
  }catch(e){
    toast(t('err.connection')+': '+e.message,'err');
    return false; // v5.8.44: sinaliza falha para o hook
  }finally{
    if(btn)btn.disabled=false;
  }
}

async function cloudLoad(routeId){
  try{
    setCloudStatus('syncing','Carregando...');
    const id=routeId||'latest';
    const res=await fetch(WORKER_URL+'/api/route/'+id);
    if(!res.ok){setCloudStatus('offline','Sem rota');return null;}
    const data=await res.json();
    _currentRouteId=data.routeId;
    _cloudVersion=data.version;
    _cloudHash=data._hash;
    if(data._viewedAt)_motoristaViewedAt=data._viewedAt; // v4.3.2
    setCloudStatus('synced','Rota online e sincronizada em tempo real');
    return data;
  }catch(e){
    setCloudStatus('offline','Sem conexao');
    return null;
  }
}

let _cloudPolling=false; // v4.7.0: guard contra race condition em polls concorrentes
async function cloudPoll(){
  if(!_currentRouteId||_cloudPolling)return;
  _cloudPolling=true;
  const _pollRouteId=_currentRouteId; // v5.4.6: snapshot antes dos awaits
  // v4.3.2: Processar fila offline a cada poll
  if(_offlineQueue.length)_processOfflineQueue();
  try{
    const res=await fetch(WORKER_URL+'/api/route/'+_pollRouteId+'/poll');
    if(!_currentRouteId||_currentRouteId!==_pollRouteId)return; // rota foi limpa durante o fetch
    if(!res.ok)return;
    const data=await res.json();
    if(data.hash!==_cloudHash||data.version>_cloudVersion){
      // Mudou! Recarregar dados completos
      const route=await cloudLoad(_pollRouteId);
      if(!_currentRouteId||_currentRouteId!==_pollRouteId)return; // rota foi limpa durante o cloudLoad
      if(route){
        clients=route.clients;
        order=route.order;
        if(route.cfg){
          cfg.base=route.cfg.base||cfg.base;
          cfg.retaddr=route.cfg.retaddr||cfg.retaddr;
          cfg.saida=route.cfg.saida||cfg.saida;
          cfg.ret=route.cfg.ret||cfg.ret;
          cfg.tempo=route.cfg.tempo||cfg.tempo;
        }
        renderMotor();
        // v4.3.2: Banner de notificação para o motorista
        if(_isMotoristaMode){
          let msg='Rota atualizada pelo gestor';
          if(route._newClient){
            const nc=route.clients[route._newClient.idx];
            if(nc)msg='Novo cliente adicionado: '+nc.nome;
          }else if(route._orderChanged){
            msg='A ordem da rota foi alterada';
          }
          showUpdateBanner(msg);
        }
        // Notifica se tem cliente novo (toast legado)
        if(route._newClient){
          const nc=route.clients[route._newClient.idx];
          if(nc&&!_isMotoristaMode)toast(t('msg.new_client')+': '+nc.nome,'ok');
        }
        saveHist(); // v4.7.2: persist cloud updates (motorist data) to history
        autoSaveRoute(); // v4.7.2: persist to rota_ativa too
      }
    }
  }catch(e){
    setCloudStatus('offline','Reconectando...');
  }finally{_cloudPolling=false;} // v4.7.0: libera lock
}

// v4.3.2: Fila offline resiliente — ações do motorista são salvas localmente e sincronizam quando voltar a conexão
let _offlineQueue=safeJsonParse('rota_offline_queue',[]);
let _offlineSyncing=false;

function _saveOfflineQueue(){
  try{localStorage.setItem('rota_offline_queue',JSON.stringify(_offlineQueue));}catch(e){}
}

async function _processOfflineQueue(){
  if(_offlineSyncing||!_offlineQueue.length||!_currentRouteId)return;
  _offlineSyncing=true;
  const processed=[];
  for(let i=0;i<_offlineQueue.length;i++){
    const item=_offlineQueue[i];
    try{
      const res=await fetch(WORKER_URL+'/api/route/'+item.routeId+'/status',{
        method:'PUT',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(item.body)
      });
      const data=await res.json();
      if(data.ok){_cloudVersion=data.version;_cloudHash=data.hash;processed.push(i);}
    }catch(e){break;} // Ainda sem conexão, parar
  }
  if(processed.length){
    _offlineQueue=_offlineQueue.filter((_,i)=>!processed.includes(i));
    _saveOfflineQueue();
    if(!_offlineQueue.length){
      setCloudStatus('synced','Rota online e sincronizada em tempo real');
      toast(t('t.synced'),'ok');
    }else{
      setCloudStatus('syncing','Sincronizando... ('+_offlineQueue.length+' pendente'+((_offlineQueue.length>1)?'s':'')+')');
    }
  }
  _offlineSyncing=false;
}

// Tentar sincronizar fila a cada poll e quando volta online
window.addEventListener('online',()=>{setTimeout(_processOfflineQueue,1000);});

async function cloudUpdateStatus(clientIdx,field,value){
  if(!_currentRouteId)return;
  const body={clientIdx};
  if(field==='status')body.status=value;
  if(field==='pay')body.pay=value;
  if(field==='obs')body.obs=value;
  if(field==='done')body.done=value;
  try{
    const res=await fetch(WORKER_URL+'/api/route/'+_currentRouteId+'/status',{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const data=await res.json();
    if(data.ok){
      _cloudVersion=data.version;
      _cloudHash=data.hash;
      setCloudStatus('synced','Rota online e sincronizada em tempo real');
      // Aproveitar para processar fila pendente
      if(_offlineQueue.length)_processOfflineQueue();
    }
  }catch(e){
    // Sem conexão — salvar na fila offline
    _offlineQueue.push({routeId:_currentRouteId,body,ts:Date.now()});
    _saveOfflineQueue();
    setCloudStatus('offline','Sem conex\xe3o ('+_offlineQueue.length+' a\xe7\xe3o'+((_offlineQueue.length>1)?'\xf5es':'')+' salva'+((_offlineQueue.length>1)?'s':'')+' offline)');
  }
}

function startMotoristaPolling(){
  if(_pollTimer)clearInterval(_pollTimer);
  _pollTimer=setInterval(cloudPoll,10000); // 10s (v4.3.1: mais rápido para atualizações)
}

function stopMotoristaPolling(){
  if(_pollTimer){clearInterval(_pollTimer);_pollTimer=null;}
}

// Gestor: polling para acompanhar motorista em tempo real
let _gestorPollTimer=null;
function startGestorPolling(){
  if(_gestorPollTimer)clearInterval(_gestorPollTimer);
  _gestorPollTimer=setInterval(async()=>{
    if(!_currentRouteId)return;
    try{
      const _pollRouteId=_currentRouteId; // v5.4.6: snapshot antes dos awaits
      const res=await fetch(WORKER_URL+'/api/route/'+_pollRouteId+'/poll');
      if(!_currentRouteId||_currentRouteId!==_pollRouteId)return; // rota foi limpa durante o fetch
      if(!res.ok)return;
      const data=await res.json();
      if(data.hash!==_cloudHash||data.version>_cloudVersion){
        const route=await cloudLoad(_pollRouteId);
        if(!_currentRouteId||_currentRouteId!==_pollRouteId)return; // rota foi limpa durante o cloudLoad
        if(route){
          clients=route.clients;order=route.order;
          if(route.cfg){cfg.base=route.cfg.base||cfg.base;cfg.retaddr=route.cfg.retaddr||cfg.retaddr;cfg.saida=route.cfg.saida||cfg.saida;cfg.ret=route.cfg.ret||cfg.ret;cfg.tempo=route.cfg.tempo||cfg.tempo;}
          renderMotor();
          // v4.9.2: Gestor polling PRECISA salvar histórico — sem isso, dados do motorista não persistem nos donuts
          saveHist();
          autoSaveRoute();
          toast(t('msg.driver_update'),'ok');
        }
      }
    }catch(e){}
  },10000); // 10s para gestor (v4.3.1: sincronizado com motorista)
}

/* ══════════════════════════════════════════════════════════════
   SMART CLIENT INSERTION
   ══════════════════════════════════════════════════════════════ */
function openSmartInsert(){
  if(!clients.length){toast(t('e.route'),'err');return;}
  ['si-nome','si-cep','si-end','si-num','si-comp','si-tel','si-obs','si-val','si-hi','si-hf'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  document.getElementById('si-qtd').value='';
  initTagMultiSelect('si-tipo',[]);
  document.getElementById('si-valtipo').value='normal';
  document.getElementById('si-janela').value='livre';
  toggleSiValTipo();toggleSiJanela();
  document.getElementById('smart-insert-modal').classList.add('on');
}

async function doSmartInsert(){
  const nome=titleCase(document.getElementById('si-nome').value.trim());
  // v5.8.25: monta endereço a partir dos campos separados
  const end=titleCase(buildFullAddr('si'));
  const siLogr=document.getElementById('si-end')?.value.trim();
  if(!nome||!siLogr){toast(t('err.fill_required'),'err');return;}
  if(!document.getElementById('si-num')?.value.trim()){toast('Informe o n\u00famero do endere\u00e7o','err');shakeField('si-num','N\u00famero obrigat\u00f3rio');return;}
  if(end.length<6){toast(t('err.addr_invalid'),'err');return;}

  const btn=document.getElementById('si-btn');
  btn.disabled=true;
  btn.innerHTML='<span class="spin"></span> Inserindo...';

  const siValTipo=document.getElementById('si-valtipo').value||'normal';
  const siJanela=document.getElementById('si-janela').value||'livre';
  const siCep=document.getElementById('si-cep').value.replace(/\D/g,'');
  const newClient={
    id:Date.now(),nome,endereco:end,cep:siCep,
    complemento:'',
    tel:document.getElementById('si-tel').value.trim(),
    
    tipo:getFormTags('si-tipo'),
    qtd:parseInt(document.getElementById('si-qtd').value)||0,
    val:siValTipo==='normal'?(parseFloat((document.getElementById('si-val').value||'0').replace(',','.'))||0):0,
    valTipo:siValTipo,janela:siJanela,
    hi:siJanela==='custom'?document.getElementById('si-hi').value:'',
    hf:siJanela==='custom'?document.getElementById('si-hf').value:'',
    obs:document.getElementById('si-obs').value.trim(),
    data:clients[0]?.data||new Date().toISOString().split('T')[0],
    lat:null,lng:null,estT:null,
    _motStatus:null,_motPay:null,_motObs:'',_motDone:false
  };

  // v4.3.1: Encontrar melhor posição geográfica entre paradas não concluídas
  const newIdx=clients.length;
  clients.push(newClient);

  // Geocode o novo cliente para ter coordenadas
  try{
    const geo=await nominatim(newClient.endereco);
    if(geo){newClient.lat=geo.lat;newClient.lng=geo.lng;}
  }catch(e){}

  // Encontrar primeiro não-concluído
  let firstPendingPos=order.findIndex(i=>!clients[i]._motDone);
  if(firstPendingPos<0)firstPendingPos=order.length;

  // Se novo cliente tem coordenadas, calcular melhor posição entre pendentes
  let bestPos=firstPendingPos; // fallback: logo após último concluído
  if(newClient.lat&&newClient.lng){
    const pendingSlice=order.slice(firstPendingPos);
    if(pendingSlice.length>=2){
      // Testar cada posição e encontrar a que minimiza desvio de distância
      let minCost=Infinity;
      const haversine=(lat1,lng1,lat2,lng2)=>{
        const R=6371;const dLat=(lat2-lat1)*Math.PI/180;const dLng=(lng2-lng1)*Math.PI/180;
        const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
        return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
      };
      for(let p=0;p<=pendingSlice.length;p++){
        const prev=p===0?(firstPendingPos>0?clients[order[firstPendingPos-1]]:null):clients[pendingSlice[p-1]];
        const next=p<pendingSlice.length?clients[pendingSlice[p]]:null;
        let cost=0;
        if(prev&&prev.lat&&prev.lng)cost+=haversine(prev.lat,prev.lng,newClient.lat,newClient.lng);
        if(next&&next.lat&&next.lng)cost+=haversine(newClient.lat,newClient.lng,next.lat,next.lng);
        // Subtrair distância direta prev→next (que seria eliminada)
        if(prev&&prev.lat&&next&&next.lat)cost-=haversine(prev.lat,prev.lng,next.lat,next.lng);
        if(cost<minCost){minCost=cost;bestPos=firstPendingPos+p;}
      }
    }
  }

  order.splice(bestPos,0,newIdx);
  const insertAfterIdx=bestPos>0?order[bestPos-1]:-1;

  // Publica no cloud se tiver rota ativa
  if(_currentRouteId){
    try{
      await fetch(WORKER_URL+'/api/route/'+_currentRouteId+'/client',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({client:newClient,insertAfterIdx})
      });
    }catch(e){}
  }

  closeModal('smart-insert-modal');
  renderC();updStats();renderMotor();
  saveHist();_dashCache.loaded=false;_dashCache.br=null;_dashCache.pts=null;setTimeout(()=>{preloadDashData();},1000);
  // v4.3.1: Forçar republish completo para motorista receber imediatamente
  if(_currentRouteId){
    try{
      const body={routeId:_currentRouteId,clients:JSON.parse(JSON.stringify(clients)),order:[...order],
        cfg:{base:cfg.base,retaddr:cfg.retaddr,saida:cfg.saida,ret:cfg.ret,tempo:cfg.tempo},
        date:clients[0]?.data||new Date().toISOString().split('T')[0]};
      const pubRes=await fetch(WORKER_URL+'/api/route/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const pubData=await pubRes.json();
      if(pubData.ok){_cloudVersion=pubData.version;_cloudHash=pubData.hash;}
    }catch(e){}
  }
  toast(t('msg.new_client')+': '+nome,'ok');

  btn.disabled=false;
  btn.innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span> Inserir na rota';
}

/* ══════════════════════════════════════════════════════════════
   ROUTE COMPLETION SUMMARY
   ══════════════════════════════════════════════════════════════ */
function checkCompletion(){
  if(!order.length)return;
  const allDone=order.every(i=>clients[i]._motDone);
  if(allDone)showCompletionSummary();
}

function showCompletionSummary(){
  const total=order.length;
  const done=order.filter(i=>clients[i]._motStatus==='coletado'||clients[i]._motStatus==='entregue').length;
  const ausente=order.filter(i=>clients[i]._motStatus==='ausente').length;
  const reagendar=order.filter(i=>clients[i]._motStatus==='reagendar').length;

  // Valores
  let recebido=0,aCobrar=0,totalVal=0;
  order.forEach(i=>{
    const c=clients[i];
    const v=parseFloat(c.val)||0;
    if(!v||c.valTipo==='pago'||c.valTipo==='medir')return;
    totalVal+=v;
    if(c._motPay==='Pix (cobrar)')aCobrar+=v;
    else if(c._motPay)recebido+=v;
  });

  // Quantidade de itens
  const _cId=_resolveTagId('coleta'),_eId=_resolveTagId('entrega');
  const tapR=order.filter(i=>normalizeTipo(clients[i].tipo).includes(_cId)).reduce((s,i)=>s+(clients[i].qtd||0),0);
  const tapE=order.filter(i=>normalizeTipo(clients[i].tipo).includes(_eId)).reduce((s,i)=>s+(clients[i].qtd||0),0);

  const d=clients[0]?.data?new Date(clients[0].data+'T12:00').toLocaleDateString(_lang==='en'?'en-US':'pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}):'';
  document.getElementById('compl-sub').textContent=d+' — '+total+' '+t('comp.stops');
  document.getElementById('compl-charts').innerHTML=buildChartsHTML(clients,order);

  const pct=total?Math.round(done/total*100):0;
  document.getElementById('compl-stats').innerHTML=
    '<div class="completion-stat"><div class="cs-val">'+pct+'%</div><div class="cs-label">'+t('comp.completed')+'</div></div>'
    +'<div class="completion-stat"><div class="cs-val">'+ausente+'</div><div class="cs-label">'+t('comp.absent')+'</div></div>'
    +'<div class="completion-stat"><div class="cs-val">R$ '+fmtBRL(recebido)+'</div><div class="cs-label">'+t('comp.received')+'</div></div>'
    +'<div class="completion-stat"><div class="cs-val">R$ '+fmtBRL(aCobrar)+'</div><div class="cs-label">'+t('comp.to_charge')+'</div></div>'
    +'<div class="completion-stat"><div class="cs-val">'+tapR+'</div><div class="cs-label">'+t('comp.collected')+'</div></div>'
    +'<div class="completion-stat"><div class="cs-val">'+tapE+'</div><div class="cs-label">'+t('comp.delivered')+'</div></div>';

  document.getElementById('completion-overlay').classList.add('on');
}

function closeCompletion(){
  document.getElementById('completion-overlay').classList.remove('on');
}

function shareCompletionWhatsApp(){
  const total=order.length;
  const done=order.filter(i=>clients[i]._motStatus==='coletado'||clients[i]._motStatus==='entregue').length;
  const ausente=order.filter(i=>clients[i]._motStatus==='ausente').length;
  let recebido=0,aCobrar=0;
  order.forEach(i=>{
    const c=clients[i];
    const v=parseFloat(c.val)||0;
    if(!v||c.valTipo==='pago'||c.valTipo==='medir')return;
    if(c._motPay==='Pix (cobrar)')aCobrar+=v;
    else if(c._motPay)recebido+=v;
  });
  const d=clients[0]?.data?new Date(clients[0].data+'T12:00').toLocaleDateString(_lang==='en'?'en-US':'pt-BR',{day:'2-digit',month:'2-digit'}):'';
  const text='*'+t('whatsapp.summary')+' '+d+'*\n'
    +done+'/'+total+' '+t('comp.completed').toLowerCase()
    +(ausente?' | '+ausente+' '+t('comp.absent').toLowerCase():'')
    +'\n'+t('comp.received')+': R$ '+fmtBRL(recebido)
    +(aCobrar?'\n'+t('comp.to_charge')+': R$ '+fmtBRL(aCobrar):'')
    +'\n\n_'+t('whatsapp.route')+'_';
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
}

/* v4.7.5: PERFORMANCE DASHBOARD removido a pedido do Philip */


// v4.3.9: Custom div-based select component
// Wraps native <select> with styled div dropdown, keeps .value compatible
function initCustomSelects(){
  document.querySelectorAll('select:not([data-csel-init])').forEach(sel=>{
    // Initialize ALL selects regardless of visibility (modals are hidden initially)
    sel.setAttribute('data-csel-init','1');

    const wrap=document.createElement('div');
    wrap.className='csel-wrap';
    sel.parentNode.insertBefore(wrap,sel);
    wrap.appendChild(sel);

    const chevronSvg='<svg class="csel-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

    const display=document.createElement('div');
    display.className='csel-display';

    const dd=document.createElement('div');
    dd.className='csel-dropdown';

    function buildOptions(){
      dd.innerHTML='';
      Array.from(sel.options).forEach(opt=>{
        const item=document.createElement('div');
        item.className='csel-option'+(opt.value===sel.value?' selected':'');
        item.dataset.value=opt.value;
        item.innerHTML='<span class="csel-dot"></span>'+opt.textContent;
        item.addEventListener('click',e=>{
          e.stopPropagation();
          sel.value=opt.value;
          sel.dispatchEvent(new Event('change'));
          updateDisplay();
          closeDD();
        });
        dd.appendChild(item);
      });
    }

    function updateDisplay(){
      const selectedOpt=sel.options[sel.selectedIndex];
      display.innerHTML=(selectedOpt?selectedOpt.textContent:'')+chevronSvg;
      // Update selected class
      dd.querySelectorAll('.csel-option').forEach(o=>{
        o.classList.toggle('selected',o.dataset.value===sel.value);
      });
    }

    function closeDD(){
      dd.classList.remove('open');
      display.classList.remove('open');
    }

    display.addEventListener('click',e=>{
      e.stopPropagation();
      const isOpen=dd.classList.contains('open');
      // Close all other open custom selects
      document.querySelectorAll('.csel-dropdown.open').forEach(d=>{d.classList.remove('open');d.previousElementSibling.classList.remove('open');});
      if(!isOpen){
        buildOptions();
        dd.classList.add('open');
        display.classList.add('open');
      }
    });

    wrap.appendChild(display);
    wrap.appendChild(dd);
    buildOptions();
    updateDisplay();

    // Observe value changes from JS (for resetForm, editC, etc.)
    const origDesc=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
    // Use MutationObserver instead — watch for selectedIndex changes
    new MutationObserver(()=>{updateDisplay();}).observe(sel,{attributes:true,childList:true,subtree:true});
    // Also patch value setter for programmatic changes
    const _origValue=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value');
    if(_origValue&&_origValue.set){
      Object.defineProperty(sel,'value',{
        get:function(){return _origValue.get.call(this);},
        set:function(v){_origValue.set.call(this,v);updateDisplay();},
        configurable:true
      });
    }
  });
  // Close dropdowns when clicking outside
  document.addEventListener('click',()=>{
    document.querySelectorAll('.csel-dropdown.open').forEach(d=>{d.classList.remove('open');d.previousElementSibling.classList.remove('open');});
  });
}

// ════════════════════════════════════════════════════════════
// SECTION: AUTH
// ════════════════════════════════════════════════════════════

/* ══════════════════════════════════════════════════════════════
   v5.0.0: SISTEMA DE CONTAS + AUTH + SYNC
   ══════════════════════════════════════════════════════════════ */
let _authUser=null,_authToken=null;
const _AUTH_KEY='rota_auth';

function _authGetSession(){try{const r=localStorage.getItem(_AUTH_KEY);if(!r)return null;const d=JSON.parse(r);if(!d||!d.token||!d.user||!d.user.id)return null;if(d.expiresAt&&Date.now()>d.expiresAt){localStorage.removeItem(_AUTH_KEY);return null;}return d;}catch(e){return null;}}
function _authSaveSession(u,t){_authUser=u;_authToken=t;localStorage.setItem(_AUTH_KEY,JSON.stringify({user:u,token:t,expiresAt:Date.now()+(30*86400000)}));_authUpdateConfigUI();_admCheckSuperadmin();}
function _authClearSession(){_authUser=null;_authToken=null;localStorage.removeItem(_AUTH_KEY);_authUpdateConfigUI();_admCheckSuperadmin();}
function _authShowScreen(){document.documentElement.classList.add('auth-pending');document.getElementById('auth-screen').style.display='flex';_authGoogle();/* v5.4.9: eager-load SDK para evitar duplo toque */}
function _authHideScreen(){document.documentElement.classList.remove('auth-pending');document.getElementById('auth-screen').style.display='none';document.querySelector('nav').style.display='';}
function _authShowLogin(){document.getElementById('auth-login-form').style.display='';document.getElementById('auth-register-form').style.display='none';document.getElementById('auth-forgot-form').style.display='none';const e=document.getElementById('auth-login-error');if(e)e.style.display='none';}
function _authShowRegister(){document.getElementById('auth-login-form').style.display='none';document.getElementById('auth-register-form').style.display='';document.getElementById('auth-forgot-form').style.display='none';const e=document.getElementById('auth-reg-error');if(e)e.style.display='none';}
function _authForgot(){document.getElementById('auth-login-form').style.display='none';document.getElementById('auth-register-form').style.display='none';document.getElementById('auth-forgot-form').style.display='';const em=document.getElementById('auth-email').value;if(em)document.getElementById('auth-forgot-email').value=em;}
function _authShowError(id,msg){const el=document.getElementById(id);el.textContent=msg;el.style.display='block';}
function _authSkip(){/* v5.2.0: skip removido — login obrigatorio */}

async function _authLoginSubmit(){
  const email=document.getElementById('auth-email').value.trim().toLowerCase(),pass=document.getElementById('auth-pass').value;
  if(!email||!email.includes('@')){_authShowError('auth-login-error','Digite um email valido');return;}
  if(!pass||pass.length<6){_authShowError('auth-login-error','Senha deve ter no minimo 6 caracteres');return;}
  const btn=document.getElementById('auth-login-btn');btn.disabled=true;btn.textContent='Entrando...';
  try{const res=await fetch(WORKER_URL+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pass})});const data=await res.json();
  if(data.ok&&data.token){_authSaveSession(data.user,data.token);_authHideScreen();await _syncPull();_initApp();_startMirrorPoll();toast('Bem-vindo de volta!','ok');}
  else _authShowError('auth-login-error',data.error||'Email ou senha incorretos');
  }catch(e){_authShowError('auth-login-error','Sem conexao. Tente novamente.');}finally{btn.disabled=false;btn.textContent='Entrar';}
}
async function _authRegisterSubmit(){
  const name=document.getElementById('auth-reg-name').value.trim(),email=document.getElementById('auth-reg-email').value.trim().toLowerCase(),pass=document.getElementById('auth-reg-pass').value,pass2=document.getElementById('auth-reg-pass2').value;
  if(!name||name.length<2){_authShowError('auth-reg-error','Digite seu nome');return;}
  if(!email||!email.includes('@')){_authShowError('auth-reg-error','Digite um email valido');return;}
  if(!pass||pass.length<8){_authShowError('auth-reg-error','Senha deve ter no minimo 8 caracteres');return;}
  if(pass!==pass2){_authShowError('auth-reg-error','As senhas nao coincidem');return;}
  const btn=document.getElementById('auth-reg-btn');btn.disabled=true;btn.textContent='Criando conta...';
  try{const res=await fetch(WORKER_URL+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password:pass})});const data=await res.json();
  if(data.ok&&data.token){_authSaveSession(data.user,data.token);_authHideScreen();await _syncPush();_initApp();toast('Conta criada com sucesso!','ok');}
  else _authShowError('auth-reg-error',data.error||'Erro ao criar conta');
  }catch(e){_authShowError('auth-reg-error','Sem conexao. Tente novamente.');}finally{btn.disabled=false;btn.textContent='Criar conta';}
}
async function _authForgotSubmit(){
  const email=document.getElementById('auth-forgot-email').value.trim().toLowerCase();
  if(!email||!email.includes('@')){_authShowError('auth-forgot-error','Digite um email valido');return;}
  try{await fetch(WORKER_URL+'/api/auth/forgot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
  document.getElementById('auth-forgot-form').innerHTML='<h2>Email enviado</h2><p style="text-align:center;color:var(--mu);font-size:13px;margin-bottom:16px">Se existir uma conta com este email, voce recebera um link para redefinir a senha.</p><div class="auth-footer"><a onclick="_authShowLogin()">Voltar ao login</a></div>';
  }catch(e){_authShowError('auth-forgot-error','Sem conexao. Tente novamente.');}
}

// Google OAuth
/* v5.2.0: Google Sign-In — fluxo Linear/Notion: clique → popup → seleciona conta → login direto.
   Nosso botão bonito fica sempre visível. O widget do Google renderiza como overlay invisível por cima.
   Quando o usuário clica, o SDK do Google captura o clique → popup abre → seleciona conta → callback dispara → login imediato. */
let _googleInited=false;
let _googleLoading=false;
let _googlePendingClick=false;
function _authGoogle(fromClick){
  if(fromClick)_googlePendingClick=true;
  if(!window.google?.accounts?.id){
    if(_googleLoading)return;
    _googleLoading=true;
    const s=document.createElement('script');
    s.src='https://accounts.google.com/gsi/client';
    s.onload=()=>{_googleLoading=false;_initGoogleAuth();};
    s.onerror=()=>{_googleLoading=false;_googlePendingClick=false;_authShowError('auth-login-error','Erro ao carregar Google. Tente novamente.');};
    document.head.appendChild(s);
  }else{
    _initGoogleAuth();
  }
}
function _initGoogleAuth(){
  const cid=localStorage.getItem('rota_google_client_id')||'251116670672-eulttck17vcso97daub1n7gbruiku2bn.apps.googleusercontent.com';
  if(!cid){_authShowError('auth-login-error','Google OAuth nao configurado. Use email/senha.');return;}
  if(!_googleInited){
    google.accounts.id.initialize({client_id:cid,callback:_handleGoogleCred,auto_select:false,cancel_on_tap_outside:true,use_fedcm_for_prompt:false});
    _googleInited=true;
  }
  document.querySelectorAll('.g-signin-wrap').forEach(el=>{
    google.accounts.id.renderButton(el,{type:'standard',theme:'outline',size:'large',text:'signin_with',width:400,logo_alignment:'left'});
  });
  document.querySelectorAll('.auth-google-wrap').forEach(w=>w.classList.add('gsi-ready'));
  /* v5.5.0: Se o usuario clicou antes do SDK carregar, dispara prompt() automaticamente */
  if(_googlePendingClick){
    _googlePendingClick=false;
    google.accounts.id.prompt();
  }
}
async function _handleGoogleCred(r){
  if(!r.credential)return;
  /* Feedback visual imediato — loading no botão */
  document.querySelectorAll('.auth-social.google').forEach(b=>{b.style.opacity='0.6';b.style.pointerEvents='none';});
  const _restoreBtn=()=>document.querySelectorAll('.auth-social.google').forEach(b=>{b.style.opacity='';b.style.pointerEvents='';});
  try{
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),20000);
    let res;
    try{
      res=await fetch(WORKER_URL+'/api/auth/google',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:r.credential}),signal:ctrl.signal});
    }catch(netErr){
      clearTimeout(timer);
      const msg=netErr.name==='AbortError'?'Conexao lenta. Tente novamente.':'Sem conexao com o servidor. Verifique sua internet.';
      _authShowError('auth-login-error',msg);_restoreBtn();return;
    }
    clearTimeout(timer);
    let d;
    try{d=await res.json();}catch(e){
      _authShowError('auth-login-error','Erro inesperado do servidor ('+res.status+'). Tente novamente.');_restoreBtn();return;
    }
    if(d.ok&&d.token){
      _authSaveSession(d.user,d.token);
      _authHideScreen();
      if(d.isNew)await _syncPush();else await _syncPull();
      _initApp();
      toast(d.isNew?'Conta criada com Google!':'Bem-vindo de volta!','ok');
    }else{
      _authShowError('auth-login-error',d.error||'Erro ao autenticar com Google');
      _restoreBtn();
    }
  }catch(e){
    _authShowError('auth-login-error','Erro inesperado. Tente novamente.');
    _restoreBtn();
  }
}

// v5.2.0: Facebook OAuth — desativado por decisão do Philip. Reativar no futuro se necessário.
function _authFacebook(){toast('Facebook Login desativado temporariamente. Use Google ou email/senha.','warn');}
/*
function _authFacebook_ORIGINAL(){const aid=localStorage.getItem('rota_fb_app_id')||'277188272955939';if(!aid){_authShowError('auth-login-error','Facebook Login nao configurado. Use email/senha.');return;}if(!window.FB){window.fbAsyncInit=function(){FB.init({appId:aid,cookie:true,xfbml:false,version:'v19.0'});_doFBLogin();};const s=document.createElement('script');s.src='https://connect.facebook.net/pt_BR/sdk.js';s.onerror=()=>_authShowError('auth-login-error','Erro ao carregar Facebook.');document.head.appendChild(s);}else _doFBLogin();}
function _doFBLogin(){FB.login(async function(r){if(!r.authResponse)return;try{const res=await fetch(WORKER_URL+'/api/auth/facebook',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accessToken:r.authResponse.accessToken})});const d=await res.json();if(d.ok&&d.token){_authSaveSession(d.user,d.token);_authHideScreen();if(d.isNew)await _syncPush();else await _syncPull();_initApp();toast(d.isNew?'Conta criada com Facebook!':'Bem-vindo de volta!','ok');}else _authShowError('auth-login-error',d.error||'Erro com Facebook');}catch(e){_authShowError('auth-login-error','Sem conexao.');}},{scope:'email,public_profile'});}
*/

function _authLogout(){showConfirm('Sair da conta','Tem certeza que deseja sair? Seus dados locais serao mantidos.',()=>{_authClearSession();_updateNavAuthBtn();toast('Voce saiu da conta','ok');});}

// v5.2.0: Nav avatar + dropdown (Linear/Notion style)
function _navAuthToggleDropdown(e){e.stopPropagation();const dd=document.getElementById('nav-dropdown');if(!_authUser){_authShowLogin();_authShowScreen();return;}dd.classList.toggle('open');}
function _navDdGoSettings(){document.getElementById('nav-dropdown').classList.remove('open');goPage('cfg',document.querySelectorAll('.ntab')[4]);}
document.addEventListener('click',function(e){const dd=document.getElementById('nav-dropdown');if(dd&&!e.target.closest('#nav-auth-btn'))dd.classList.remove('open');});
function _updateNavAuthBtn(){const btn=document.getElementById('nav-auth-btn');const av=document.getElementById('nav-avatar');if(!btn)return;btn.style.display='flex';if(_authUser){btn.classList.add('logged-in');btn.title=_authUser.name||'Conta';const initials=(_authUser.name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);av.textContent=initials;av.classList.remove('generic');av.style.background='';document.getElementById('nav-dd-name').textContent=_authUser.name||'Usuario';document.getElementById('nav-dd-email').textContent=_authUser.email||'';const plan=_authUser.plan||'free';document.getElementById('nav-dd-plan').textContent=plan;}else{btn.classList.remove('logged-in');btn.title='Entrar';av.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';av.classList.add('generic');}}

function _authUpdateConfigUI(){const card=document.getElementById('cfg-account-card');const logoutWrap=document.getElementById('cfg-logout-wrap');const admFooter=document.getElementById('adm-footer-wrap');if(_authUser){if(card){card.style.display='';document.getElementById('cfg-user-name').textContent=_authUser.name||'Usuario';document.getElementById('cfg-user-email').textContent=_authUser.email||'';document.getElementById('cfg-avatar').textContent=(_authUser.name||'U').charAt(0).toUpperCase();document.getElementById('cfg-auth-providers').innerHTML=_authUser.provider==='google'?'<span class="auth-provider-badge">Google</span>':_authUser.provider==='facebook'?'<span class="auth-provider-badge">Facebook</span>':'<span class="auth-provider-badge">Email</span>';}if(logoutWrap)logoutWrap.style.display='';if(admFooter)admFooter.style.display='';}else{if(card)card.style.display='none';if(logoutWrap)logoutWrap.style.display='none';if(admFooter)admFooter.style.display='none';}}

// ═══════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
// SECTION: ADMIN PANEL
// ════════════════════════════════════════════════════════════

// v5.4.0: ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
let _admPage=1,_admSort='createdAt',_admDir='desc',_admSearchTimer=null,_admInited=false;

function _admCheckSuperadmin(){
  if(_authUser&&_authUser.role==='superadmin'){
    document.body.classList.add('is-superadmin');
  }else{
    document.body.classList.remove('is-superadmin');
  }
}

function _admInit(){
  if(!_authUser||_authUser.role!=='superadmin'){toast('Acesso restrito a administradores.','warn');return;}
  _admLoadStats();
  _admLoadUsers();
  _admLoadPlans();
}

async function _admLoadStats(){
  try{
    const res=await fetch(WORKER_URL+'/api/admin/stats',{headers:_authHeaders()});
    if(!res.ok)throw new Error('Erro '+res.status);
    const d=await res.json();
    document.getElementById('adm-total-users').textContent=d.totalUsers||0;
    document.getElementById('adm-active-today').textContent=d.activeToday||0;
    document.getElementById('adm-new-week').textContent=d.newThisWeek||0;
    document.getElementById('adm-mrr').textContent='R$ '+(d.mrr||0).toLocaleString('pt-BR');
    // Distribution
    const fmtObj=(obj)=>Object.entries(obj||{}).map(([k,v])=>'<span class="adm-badge '+k+'">'+k+': '+v+'</span>').join(' ');
    document.getElementById('adm-by-plan').innerHTML=fmtObj(d.byPlan);
    document.getElementById('adm-by-status').innerHTML=fmtObj(d.byStatus);
    document.getElementById('adm-by-provider').innerHTML=fmtObj(d.byProvider);
  }catch(e){console.warn('[ADM] Stats error:',e.message);toast('Erro ao carregar stats admin','error');}
}

async function _admLoadUsers(){
  const search=document.getElementById('adm-search')?.value||'';
  const plan=document.getElementById('adm-filter-plan')?.value||'';
  const status=document.getElementById('adm-filter-status')?.value||'';
  const params=new URLSearchParams({search,plan,status,sort:_admSort,dir:_admDir,page:_admPage,limit:20});
  try{
    const res=await fetch(WORKER_URL+'/api/admin/users?'+params,{headers:_authHeaders()});
    if(!res.ok)throw new Error('Erro '+res.status);
    const d=await res.json();
    const tbody=document.getElementById('adm-users-body');
    if(!d.users||d.users.length===0){
      tbody.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--mu)">Nenhum usuário encontrado</td></tr>';
    }else{
      tbody.innerHTML=d.users.map(u=>{
        const created=u.createdAt?new Date(u.createdAt).toLocaleDateString('pt-BR'):'--';
        const prov=u.provider||'email';
        const plan=u.plan||'free';
        const st=u.status||'active';
        return '<tr>'+
          '<td><strong>'+_escHtml(u.name||'--')+'</strong></td>'+
          '<td>'+_escHtml(u.email||'--')+'</td>'+
          '<td><span class="adm-badge '+prov+'">'+prov+'</span></td>'+
          '<td><span class="adm-badge '+plan+'">'+plan+'</span></td>'+
          '<td><span class="adm-badge '+st+'">'+st+'</span></td>'+
          '<td>'+created+'</td>'+
          '<td class="adm-actions"><button onclick="_admShowUser(\''+u.id+'\')">Ver</button></td>'+
        '</tr>';
      }).join('');
    }
    // Pagination
    const pg=document.getElementById('adm-pagination');
    if(d.totalPages>1){
      pg.innerHTML='<button onclick="_admGoPage('+(d.page-1)+')" '+(d.page<=1?'disabled':'')+'>← Anterior</button>'+
        '<span>Página '+d.page+' de '+d.totalPages+' ('+d.total+' usuários)</span>'+
        '<button onclick="_admGoPage('+(d.page+1)+')" '+(d.page>=d.totalPages?'disabled':'')+'>Próxima →</button>';
    }else{
      pg.innerHTML=d.total?'<span>'+d.total+' usuário(s)</span>':'';
    }
  }catch(e){console.warn('[ADM] Users error:',e.message);toast('Erro ao carregar usuários','error');}
}

function _admGoPage(p){_admPage=p;_admLoadUsers();}
function _admSetSort(field){
  if(_admSort===field){_admDir=_admDir==='asc'?'desc':'asc';}
  else{_admSort=field;_admDir='asc';}
  _admPage=1;_admLoadUsers();
}
function _admSearchDebounce(){clearTimeout(_admSearchTimer);_admSearchTimer=setTimeout(()=>{_admPage=1;_admLoadUsers();},350);}

function _escHtml(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}

async function _admShowUser(userId){
  try{
    const res=await fetch(WORKER_URL+'/api/admin/users/'+userId,{headers:_authHeaders()});
    if(!res.ok)throw new Error('Erro '+res.status);
    const u=await res.json();
    const detail=document.getElementById('adm-user-detail');
    const created=u.createdAt?new Date(u.createdAt).toLocaleString('pt-BR'):'--';
    const lastLogin=u.lastLogin?new Date(u.lastLogin).toLocaleString('pt-BR'):'Nunca';
    let html='<div class="adm-detail-row"><span class="adm-detail-label">Nome</span><span class="adm-detail-val">'+_escHtml(u.name||'--')+'</span></div>'+
      '<div class="adm-detail-row"><span class="adm-detail-label">Email</span><span class="adm-detail-val">'+_escHtml(u.email||'--')+'</span></div>'+
      '<div class="adm-detail-row"><span class="adm-detail-label">Provedor</span><span class="adm-detail-val"><span class="adm-badge '+(u.provider||'email')+'">'+(u.provider||'email')+'</span></span></div>'+
      '<div class="adm-detail-row"><span class="adm-detail-label">Plano</span><span class="adm-detail-val"><span class="adm-badge '+(u.plan||'free')+'">'+(u.plan||'free')+'</span></span></div>'+
      '<div class="adm-detail-row"><span class="adm-detail-label">Status</span><span class="adm-detail-val"><span class="adm-badge '+(u.status||'active')+'">'+(u.status||'active')+'</span></span></div>'+
      '<div class="adm-detail-row"><span class="adm-detail-label">Criado em</span><span class="adm-detail-val">'+created+'</span></div>'+
      '<div class="adm-detail-row"><span class="adm-detail-label">Último login</span><span class="adm-detail-val">'+lastLogin+'</span></div>';
    if(u.syncSummary){
      html+='<div class="adm-detail-row"><span class="adm-detail-label">Último sync</span><span class="adm-detail-val">'+(u.syncSummary.lastSync?new Date(u.syncSummary.lastSync).toLocaleString('pt-BR'):'Nunca')+'</span></div>'+
        '<div class="adm-detail-row"><span class="adm-detail-label">Tags</span><span class="adm-detail-val">'+u.syncSummary.tagsCount+'</span></div>'+
        '<div class="adm-detail-row"><span class="adm-detail-label">Histórico</span><span class="adm-detail-val">'+u.syncSummary.histCount+' rotas</span></div>';
    }
    if(u.planHistory&&u.planHistory.length>0){
      html+='<div style="margin-top:12px;font-size:12px;color:var(--mu)"><strong>Histórico de planos:</strong><br>'+
        u.planHistory.map(h=>h.from+' → '+h.to+' ('+new Date(h.date).toLocaleDateString('pt-BR')+')').join('<br>')+'</div>';
    }
    detail.innerHTML=html;
    // Action buttons
    const actions=document.getElementById('adm-user-actions');
    const curPlan=u.plan||'free';
    const curStatus=u.status||'active';
    actions.innerHTML='<select id="adm-change-plan" style="padding:6px 10px;border:1px solid var(--bd);border-radius:8px;font-size:12px;font-family:inherit">'+
      ['free','pro','promax','ultimate'].map(p=>'<option value="'+p+'"'+(p===curPlan?' selected':'')+'>'+p+'</option>').join('')+'</select>'+
      '<button class="btn bp" style="font-size:12px;padding:6px 12px" onclick="_admChangePlan(\''+userId+'\')">Alterar Plano</button>'+
      '<button class="btn '+(curStatus==='active'?'bd':'bp')+'" style="font-size:12px;padding:6px 12px" onclick="_admToggleStatus(\''+userId+'\',\''+(curStatus==='active'?'inactive':'active')+'\')">'+(curStatus==='active'?'Desativar':'Ativar')+'</button>';
    document.getElementById('adm-user-modal').style.display='flex';
  }catch(e){console.warn('[ADM] User detail error:',e.message);toast('Erro ao carregar detalhes','error');}
}

async function _admChangePlan(userId){
  const plan=document.getElementById('adm-change-plan')?.value;
  if(!plan)return;
  try{
    const res=await fetch(WORKER_URL+'/api/admin/users/'+userId+'/plan',{method:'PUT',headers:_authHeaders(),body:JSON.stringify({plan})});
    if(!res.ok)throw new Error('Erro');
    toast('Plano alterado para '+plan,'ok');
    document.getElementById('adm-user-modal').style.display='none';
    _admLoadUsers();_admLoadStats();
  }catch(e){toast('Erro ao alterar plano','error');}
}

async function _admToggleStatus(userId,newStatus){
  try{
    const res=await fetch(WORKER_URL+'/api/admin/users/'+userId+'/status',{method:'PUT',headers:_authHeaders(),body:JSON.stringify({status:newStatus})});
    if(!res.ok)throw new Error('Erro');
    toast('Status alterado para '+newStatus,'ok');
    document.getElementById('adm-user-modal').style.display='none';
    _admLoadUsers();_admLoadStats();
  }catch(e){toast('Erro ao alterar status','error');}
}

async function _admLoadPlans(){
  try{
    const res=await fetch(WORKER_URL+'/api/admin/plans',{headers:_authHeaders()});
    if(!res.ok)throw new Error('Erro');
    const plans=await res.json();
    const container=document.getElementById('adm-plans');
    container.innerHTML=Object.entries(plans).map(([key,p])=>{
      const features=[];
      features.push({on:true,text:'Motoristas: '+(p.motoristas===-1?'Ilimitado':p.motoristas)});
      features.push({on:true,text:'Rotas/dia: '+(p.rotasDia===-1?'Ilimitado':p.rotasDia)});
      features.push({on:p.importTrello,text:'Import Trello'});
      features.push({on:p.importExcel,text:'Import Excel'});
      features.push({on:p.cloudSync,text:'Cloud Sync'});
      features.push({on:p.ia,text:'IA ('+( p.iaCreditsMes===-1?'∞':p.iaCreditsMes)+' créditos/mês)'});
      features.push({on:p.whatsapp,text:'WhatsApp'});
      features.push({on:p.pod,text:'POD (Prova de Entrega)'});
      features.push({on:p.relatorios,text:'Relatórios'});
      features.push({on:p.apiAccess,text:'API Access'});
      features.push({on:p.whiteLabel,text:'White Label'});
      features.push({on:p.suportePrio,text:'Suporte Prioritário'});
      return '<div class="adm-plan-card">'+
        '<div class="adm-plan-name"><span class="adm-badge '+key+'">'+key+'</span> '+(p.name||key)+'</div>'+
        '<div class="adm-plan-price">R$ '+p.price+'<span>/mês</span></div>'+
        '<ul class="adm-plan-features">'+features.map(f=>'<li'+(f.on?'':' class="off"')+'>'+f.text+'</li>').join('')+'</ul>'+
      '</div>';
    }).join('');
  }catch(e){console.warn('[ADM] Plans error:',e.message);}
}

async function _admExportCSV(){
  try{
    const res=await fetch(WORKER_URL+'/api/admin/users/export',{headers:_authHeaders()});
    if(!res.ok)throw new Error('Erro');
    const csv=await res.text();
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='usuarios_roteiro_'+new Date().toISOString().split('T')[0]+'.csv';
    a.click();URL.revokeObjectURL(url);
    toast('CSV exportado!','ok');
  }catch(e){toast('Erro ao exportar CSV','error');}
}

// Sync
let _syncTimer=null;
function _authHeaders(){return _authToken?{'Authorization':'Bearer '+_authToken,'Content-Type':'application/json'}:{'Content-Type':'application/json'};}
async function _syncPull(){if(!_authToken)return;try{const res=await fetch(WORKER_URL+'/api/user/sync',{headers:_authHeaders()});if(!res.ok)return;const data=await res.json();if(!data.ok||!data.data)return;const d=data.data;const _sinceEdit=Date.now()-_lastLocalChange;if(d.cfg&&_sinceEdit>=5000&&(d.cfgUpdatedAt||0)>=_cfgUpdatedAt){Object.keys(d.cfg).forEach(k=>{if(d.cfg[k]!==undefined)cfg[k]=d.cfg[k];});localStorage.setItem('rota_cfg',JSON.stringify(cfg));_cfgUpdatedAt=d.cfgUpdatedAt||0;if(!g('page-cfg')?.classList.contains('on'))loadCfg();/* v5.8.36: não repopula form enquanto usuário está em Configurações */}if(d.tags&&Array.isArray(d.tags)&&_sinceEdit>=5000&&(d.tagsUpdatedAt||0)>=_tagsUpdatedAt){_tags=d.tags;localStorage.setItem('rota_tags',JSON.stringify(d.tags));_tagsUpdatedAt=d.tagsUpdatedAt||0;if(!g('page-cfg')?.classList.contains('on')){renderTagsConfig();updateTagSelects();}renderC();/* v5.8.36: não sobrescreve tags enquanto usuário está em Configurações */}if(d.hist&&Array.isArray(d.hist)){const local=getHist();const allEntries=[...d.hist,...local];const byDate={};allEntries.forEach(h=>{if(!byDate[h.date]||h.savedAt>byDate[h.date].savedAt)byDate[h.date]=h;});const merged=Object.values(byDate).sort((a,b)=>b.date.localeCompare(a.date));try{localStorage.setItem('rota_hist',JSON.stringify(merged.slice(0,90)));}catch(e){}renderHist();}if(d.activeRoute&&d.activeRoute.clients&&d.activeRoute.clients.length&&sessionStorage.getItem('rota_user_cleared')!=='1'){if(_sinceEdit>=5000){const localSaved=localStorage.getItem('rota_ativa');const localTs=localSaved?safeJsonParse('rota_ativa',{}).savedAt||'':'';if(d.activeRoute.savedAt>localTs){clients=d.activeRoute.clients;order=d.activeRoute.order||clients.map((_,i)=>i);if(d.activeRoute.routeId)_currentRouteId=d.activeRoute.routeId;localStorage.setItem('rota_ativa',JSON.stringify({clients,order,savedAt:d.activeRoute.savedAt,routeId:_currentRouteId||null,cloudVersion:_cloudVersion||0,cloudHash:_cloudHash||null}));renderC();updStats();updBtns();renderMotor();}}}else if(d.routeId&&!clients.length&&sessionStorage.getItem('rota_user_cleared')!=='1'){cloudLoad(d.routeId).then(route=>{if(route&&route.clients&&route.clients.length){clients=route.clients;order=route.order||clients.map((_,i)=>i);renderC();updStats();updBtns();renderMotor();_rebuildCachedMatrix();autoSaveRoute();}}).catch(()=>{});}console.log('[SYNC] Pull completo');}catch(e){console.warn('[SYNC] Pull falhou:',e.message);}}
async function _syncPush(){if(!_authToken)return;try{const activeRoute=clients.length?{clients:JSON.parse(JSON.stringify(clients)),order:[...order],savedAt:new Date().toISOString(),routeId:_currentRouteId||null}:null;const _pushRes=await fetch(WORKER_URL+'/api/user/sync',{method:'POST',headers:_authHeaders(),body:JSON.stringify({cfg,tags:safeJsonParse('rota_tags',[]),hist:getHist(),routeId:_currentRouteId||null,activeRoute,lang:_lang||'pt',theme:localStorage.getItem('rota_theme')||'light',tagsUpdatedAt:_tagsUpdatedAt||0,cfgUpdatedAt:_cfgUpdatedAt||0})});if(_pushRes.ok){console.log('[SYNC] Push completo');}else{console.warn('[SYNC] Push falhou: HTTP',_pushRes.status);}  }catch(e){console.warn('[SYNC] Push falhou:',e.message);}}
function _syncPushDebounced(){if(!_authToken)return;clearTimeout(_syncTimer);_syncTimer=setTimeout(_syncPush,800);}
let _lastLocalChange=0;
let _tagsUpdatedAt=0;
let _cfgUpdatedAt=0;
async function _syncPullRoute(){if(!_authToken)return;try{const res=await fetch(WORKER_URL+'/api/user/sync',{headers:_authHeaders()});if(!res.ok)return;const data=await res.json();if(!data.ok||!data.data)return;const d=data.data;if(!d.activeRoute||!d.activeRoute.clients||!d.activeRoute.clients.length)return;if(sessionStorage.getItem('rota_user_cleared')==='1')return;// v5.8.26: respeitar limpeza explícita
if(Date.now()-_lastLocalChange<5000)return;const localSaved=localStorage.getItem('rota_ativa');const localTs=localSaved?JSON.parse(localSaved).savedAt||'':'' ;if(d.activeRoute.savedAt<=localTs)return;clients=d.activeRoute.clients;order=d.activeRoute.order||clients.map((_,i)=>i);if(d.activeRoute.routeId&&d.activeRoute.routeId!==_currentRouteId){_currentRouteId=d.activeRoute.routeId;}localStorage.setItem('rota_ativa',JSON.stringify({clients,order,savedAt:d.activeRoute.savedAt,routeId:_currentRouteId||null,cloudVersion:_cloudVersion||0,cloudHash:_cloudHash||null}));renderC();updStats();updBtns();renderMotor();console.log('[MIRROR] Rota atualizada do outro dispositivo');}catch(e){}}
let _mirrorTimer=null;
function _startMirrorPoll(){if(_mirrorTimer)return;_mirrorTimer=setInterval(()=>{if(document.visibilityState==='visible')_syncPull();},3000);}
function _stopMirrorPoll(){clearInterval(_mirrorTimer);_mirrorTimer=null;}


// ════════════════════════════════════════════════════════════
// SECTION: INIT / STARTUP
// ════════════════════════════════════════════════════════════

// v5.0.1: Auto-limpeza da rota ao virar o dia
function _autoClearIfNewDay(){
  const today=new Date().toISOString().split('T')[0];
  const lastDate=localStorage.getItem('rota_last_date');
  localStorage.setItem('rota_last_date',today);
  if(!lastDate||lastDate===today||clients.length===0)return;
  // Dia virou e há clientes da rota anterior — salvar no histórico com a data correta
  const hist=getHist();
  const entry={date:lastDate,savedAt:new Date().toISOString(),clients:JSON.parse(JSON.stringify(clients)),order:[...order]};
  const i=hist.findIndex(h=>h.date===lastDate);
  if(i>=0)hist[i]=entry;else hist.unshift(entry);
  try{localStorage.setItem('rota_hist',JSON.stringify(hist.slice(0,90)));}catch(e){}
  // Limpar rota ativa silenciosamente
  clients=[];order=[];localStorage.removeItem('rota_ativa');
  _currentRouteId=null;_cloudVersion=0;_cloudHash='';
  renderC();updStats();updBtns();resetMap();renderHist();
  setTimeout(()=>toast(t('msg.new_day'),'ok'),500);
}

let _appInitialized=false;
function _initApp(){
  if(_appInitialized)return;_appInitialized=true;
  const now=new Date();const dateStr=now.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).replace(/\.\./g,'.').replace(/\s+/g,' ').trim();
  document.getElementById('nav-date').textContent=dateStr;
  const mobDate=document.getElementById('mobile-date');if(mobDate)mobDate.textContent=dateStr;
  document.getElementById('td').value=now.toISOString().split('T')[0];
  document.getElementById('f-data').value=now.toISOString().split('T')[0];
  loadCfg();renderHist();loadTrelloSelection();
  if(clients.length===0&&!_isMotoristaMode)restoreActiveRoute();
  // v5.8.6: Migrar endereços antigos para formato padrão
  setTimeout(()=>{_runAddrMigration();},500);
  // v5.8.8: Detectar divergência de cidade em clientes já geocodificados
  setTimeout(()=>{_runMismatchMigration();},1200);
  // v5.8.16: Limpar choices antigos sem type definido
  // v5.8.37: Preservar type:'alt' (local diferente) E type:'confirmed' (confirmou atual)
  // Choices sem type foram gerados pelo comportamento antigo e bloqueavam o audit.
  try{
    const choices=JSON.parse(localStorage.getItem('rota_addr_choices')||'{}');
    const cleaned={};let changed=false;
    for(const[k,v]of Object.entries(choices)){
      if(v&&(v.type==='alt'||v.type==='confirmed')){cleaned[k]=v;}else{changed=true;}
    }
    if(changed){localStorage.setItem('rota_addr_choices',JSON.stringify(cleaned));console.log('[v5.8.37] Removidos choices sem type definido do cache de endereços');}
  }catch(e){}
  // v5.8.17: Migration de limpeza do rota_geo_locs foi REMOVIDA em v5.8.20
  // Motivo: limpar o cache causaria spike de chamadas à API Google. O cache é cumulativo
  // e o ViaCEP agora ADICIONA novos locais aos existentes sem precisar limpar.
  // v5.8.19: Corrigir endereços stale (choice salvo com endereco não atualizado pelo pickAddr antigo)
  setTimeout(()=>{_fixStaleAddrChoices();},800);
  // v5.8.9: Auditoria de ambiguidade geográfica — compara coords armazenadas vs geocode neutro
  setTimeout(()=>{_runStoredGeoAudit();},2500);
  // v5.0.1: Auto-limpeza da rota ao virar o dia
  if(!_isMotoristaMode)_autoClearIfNewDay();
  const savedTab=localStorage.getItem('rota_active_tab');
  if(savedTab&&savedTab!=='rota'&&!_isMotoristaMode){const tm={hist:1,dash:2,motor:3,cfg:4};const ti=tm[savedTab];const nt=document.querySelectorAll('.ntab');if(ti!==undefined&&nt[ti])goPage(savedTab,nt[ti]);}
  setTimeout(()=>{preloadDashData();},2000);
  renderTagsConfig();updateTagSelects();initPreferredTab();initCustomSelects();renderAddrChoices();
  applyI18n();updateLangBtns();
  if(!cfg.ttoken){const el=g('trello-nocred');if(el)el.style.display='block';const s1=g('trello-step1');if(s1)s1.style.display='none';}
  _authUpdateConfigUI();
  _updateNavAuthBtn();
  _admCheckSuperadmin();
  if(_authToken)_startMirrorPoll();
}

document.addEventListener('DOMContentLoaded',()=>{
  // v5.4.2: Version badge (cfg + adm)
  const _vbadge=document.getElementById('app-version-badge');
  if(_vbadge)_vbadge.textContent=APP_VERSION;
  const _admVbadge=document.getElementById('adm-version-badge');
  if(_admVbadge)_admVbadge.textContent=APP_VERSION;
  // v5.0.0: Auth gate
  if(_isMotoristaMode){_authHideScreen();_initApp();}
  else{const s=_authGetSession();if(s){_authUser=s.user;_authToken=s.token;_authHideScreen();_initApp();_admCheckSuperadmin();_syncPull().catch(()=>{});}else if(localStorage.getItem('rota_auth_skipped')==='1'){_authHideScreen();_initApp();}else{_authShowScreen();setTimeout(()=>_authGoogle(),300);/* v5.5.2: fix 3 — pre-load GIS so first click works */}}
  document.querySelectorAll('.mbg').forEach(m=>{let downOnBg=false;m.addEventListener('mousedown',e=>{downOnBg=e.target===m;});m.addEventListener('click',e=>{if(e.target===m&&downOnBg)m.classList.remove('on');downOnBg=false;});});
  document.addEventListener('paste',e=>{
    const img=Array.from(e.clipboardData.items).find(i=>i.type.startsWith('image/'));
    if(img){stab('img',document.querySelectorAll('.tab')[1]);processFile(img.getAsFile());}
  });
  const upl=document.getElementById('upl');
  upl.addEventListener('dragover',e=>{e.preventDefault();upl.classList.add('drag');});
  upl.addEventListener('dragleave',()=>upl.classList.remove('drag'));
  upl.addEventListener('drop',e=>{e.preventDefault();upl.classList.remove('drag');if(e.dataTransfer.files[0])processFile(e.dataTransfer.files[0]);});
  // v4.3.5: Close tag dropdowns when clicking outside
  document.addEventListener('click',e=>{
    const dropdowns=document.querySelectorAll('.tag-dropdown[style*="display: block"]');
    dropdowns.forEach(dd=>{
      if(!dd.closest('.tag-multi-wrap')?.contains(e.target)){
        dd.style.display='none';
      }
    });
  });
});

/* Theme toggle */
// v4.8.7: toggleTheme sincroniza html E body (FOUC prevention usa html.dark)
function toggleTheme(){const isDark=!document.body.classList.contains('dark');document.body.classList.toggle('dark',isDark);document.documentElement.classList.toggle('dark',isDark);localStorage.setItem('rota_theme',isDark?'dark':'light');}
(function(){if(localStorage.getItem('rota_theme')==='dark'){document.body.classList.add('dark');document.documentElement.classList.add('dark');}
// v4.8.7: Reabilita transition após load (bloqueada durante init pra evitar flash)
requestAnimationFrame(()=>requestAnimationFrame(()=>{document.body.classList.add('theme-ready');}));})();

// v4.6.3: AUTO-SAVE — persist active route to localStorage on every change
let _autoSaveTimer=null;
function autoSaveRoute(){
  clearTimeout(_autoSaveTimer);
  // v5.4.5: rota vazia = remove IMEDIATAMENTE (sem timer), evita race condition
  if(!clients.length){localStorage.removeItem('rota_ativa');_syncPushDebounced();return;}
  _lastLocalChange=Date.now();
  _autoSaveTimer=setTimeout(()=>{
    if(clients.length>0){
      // v4.9.2: Salvar estado cloud junto — sem isso, refresh perde conexão cloud e donuts do histórico ficam zerados
      localStorage.setItem('rota_ativa',JSON.stringify({clients:clients,order:order,savedAt:new Date().toISOString(),routeId:_currentRouteId||null,cloudVersion:_cloudVersion||0,cloudHash:_cloudHash||null}));
      _syncPushDebounced();
    }
  },300);
}
function restoreActiveRoute(){
  // v5.4.7: Se o usuário limpou explicitamente nessa sessão, não restaurar
  if(sessionStorage.getItem('rota_user_cleared')==='1')return false;
  const saved=localStorage.getItem('rota_ativa');
  if(!saved)return false;
  try{
    const data=JSON.parse(saved);
    // v4.7.0: Validação robusta dos dados restaurados
    if(!Array.isArray(data.clients)||!data.clients.length)return false;
    if(!data.clients.every(c=>c&&typeof c.nome==='string'&&typeof c.endereco==='string')){console.warn('[RESTORE] Dados corrompidos');localStorage.removeItem('rota_ativa');return false;}
    // v4.9.2: AUTO-RESTORE SILENCIOSO — sem modal, sem perguntar
    // Decisão do Philip: refresh preserva tudo automaticamente. Limpar = botão "Limpar todos".
    clients=data.clients;order=data.order||clients.map((_,i)=>i);
    // v4.9.2: Restaurar estado cloud (routeId, version, hash) — permite polling retomar
    if(data.routeId){_currentRouteId=data.routeId;_cloudVersion=data.cloudVersion||0;_cloudHash=data.cloudHash||null;startGestorPolling();setCloudStatus('synced','Rota online e sincronizada em tempo real');console.log('[RESTORE] Cloud state restaurado: route='+_currentRouteId+' v'+_cloudVersion);}
    renderC();updStats();updBtns();
    // v4.6.9: Rebuild OSRM matrix em background para ETAs funcionarem no drag
    _rebuildCachedMatrix();
    // v5.8.41: Restaurar mapa/rota automaticamente se clientes têm coordenadas
    const _geocodedCount=clients.filter(c=>c.lat&&c.lng).length;
    if(_geocodedCount>=2){_pendingMapRestore=true;console.log('[RESTORE] Agendando restauração do mapa ('+_geocodedCount+' clientes geocodificados)');}
    console.log('[RESTORE] Rota restaurada silenciosamente: '+clients.length+' clientes');
    return true;
  }catch(e){return false;}
}

/* Modo Motorista Isolado — ?modo=motorista */
const _isMotoristaMode=new URLSearchParams(window.location.search).get('modo')==='motorista';
const _urlRouteId=new URLSearchParams(window.location.search).get('rota');
if(_isMotoristaMode){
  document.body.classList.add('motorista-mode');
  document.addEventListener('DOMContentLoaded',async()=>{
    // Mostrar header do modo motorista (com logo + dark mode toggle)
    const mh=document.getElementById('mot-mode-header');if(mh)mh.style.display='';
    // Forçar página do motorista como ativa
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
    document.getElementById('page-motor').classList.add('on');
    // Tentar carregar rota do cloud
    const routeId=_urlRouteId||null;
    const route=await cloudLoad(routeId);
    if(route){
      clients=route.clients;
      order=route.order;
      if(route.cfg){
        cfg.base=route.cfg.base||'';cfg.retaddr=route.cfg.retaddr||'';
        cfg.saida=route.cfg.saida||'';cfg.ret=route.cfg.ret||'';
        cfg.tempo=route.cfg.tempo||10;
      }
    }
    renderMotor();
    // v4.3.2: Notificar gestor que motorista visualizou a rota
    if(_currentRouteId){
      try{
        await fetch(WORKER_URL+'/api/route/'+_currentRouteId+'/ack',{
          method:'PUT',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({viewedAt:new Date().toISOString()})
        });
      }catch(e){}
    }
    // Iniciar polling automatico
    startMotoristaPolling();
  });
}

function g(id){return document.getElementById(id);}
function v(id){return g(id)?.value?.trim()||'';}
function toast(msg,t){const el=g('toast');el.textContent=msg;el.className='toast show '+(t||'');clearTimeout(window._tt);window._tt=setTimeout(()=>el.className='toast',3200);}
function toastCenter(){const el=g('toast-center');el.className='toast-center';void el.offsetWidth;requestAnimationFrame(()=>{el.className='toast-center show';setTimeout(()=>{el.className='toast-center show fade';},1200);setTimeout(()=>{el.className='toast-center';},1700);});}
function fmtBRL(n){return Number(n).toFixed(2).replace('.',',');}
// v4.7.4: Sanitizar emojis de nomes importados (M1 Monochrome: zero emojis)
function _stripEmoji(s){return s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,'').replace(/\s{2,}/g,' ').trim();}
function fmtNomeValor(nome,val,valTipo){
  nome=_stripEmoji(nome); // v4.7.4: remover emojis do Trello
  // Regex universal: captura "Valor 396", "Valor R$ 396,00", "Valor medir", "Valor pago"
  const rVal=/\bvalor\s+(R\$\s*)?[\d.,]+|\bvalor\s+(medir|pago)/gi;
  if(valTipo==='medir'||valTipo==='pago')return nome.replace(rVal,'Valor '+valTipo.charAt(0).toUpperCase()+valTipo.slice(1));
  if(val)return nome.replace(rVal,'Valor R$ '+fmtBRL(val));
  return nome;
}
function closeModal(id){g(id).classList.remove('on');}

function toggleEye(fid,btn){
  const inp=g(fid);
  if(inp.type==='password'){inp.type='text';btn.innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg></span>';}
  else{inp.type='password';btn.innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></span>';}
}

function loadCfg(){
  cfg=safeJsonParse('rota_cfg',{});
  ['saida','ret','tempo','base','retaddr','cidade','uf','al1','al2','tkey','ttoken','akey','gkey','etaBuffer'].forEach(k=>{if(cfg[k]!==undefined&&g('cfg-'+k))g('cfg-'+k).value=cfg[k];});
  // v4.6.2: routePriority config load removido
}
function saveCfg(){
  cfg={saida:v('cfg-saida'),ret:v('cfg-ret'),tempo:parseInt(v('cfg-tempo'))||10,
    base:v('cfg-base'),retaddr:v('cfg-retaddr'),
    cidade:v('cfg-cidade').trim(),uf:v('cfg-uf').trim().toUpperCase().slice(0,2),
    etaBuffer:(()=>{const _eb=parseInt(v('cfg-etaBuffer'));return Math.min(999,Math.max(0,isNaN(_eb)?20:_eb));})(), // v5.8.31: fix 0 válido, max 999
    al1:v('cfg-al1'),al2:v('cfg-al2'),
    tkey:v('cfg-tkey'),ttoken:v('cfg-ttoken'),
    akey:v('cfg-akey'),gkey:v('cfg-gkey')};
  // Validações
  if(cfg.saida&&cfg.ret&&cfg.saida>=cfg.ret){toast(t('err.time_order'),'err');return;}
  if(cfg.tempo>999){toast(t('err.max_time'),'err');return;}
  if(cfg.tempo<1){cfg.tempo=1;}
  if(cfg.al1&&cfg.al2&&cfg.al1>=cfg.al2){toast(t('err.lunch_order'),'err');return;}
  _lastLocalChange=Date.now();_cfgUpdatedAt=Date.now();
  localStorage.setItem('rota_cfg',JSON.stringify(cfg));
  // v4.3.3: Salvar tags configuráveis
  _saveTags();
  _syncPushDebounced();
  // v4.3.1: Resetar âncora de geocodificação quando muda endereço base
  _geoAnchor=null;
  // v4.3.7: Feedback visual — esconde barra 3s após salvar
  const saveBar=g('cfg-save-bar');
  if(saveBar){saveBar.style.display='none';setTimeout(()=>{if(g('page-cfg').classList.contains('on'))saveBar.style.display='flex';},3000);}
  toastCenter();
  let warn='';
  if(!cfg.base)warn+='<div class="ab w" style="margin-top:8px"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> <strong>Endere\xE7o de partida</strong> n\xE3o preenchido. O sistema precisa dele para calcular os hor\xE1rios de chegada nos clientes.</div>';
  if(!cfg.saida)warn+='<div class="ab w" style="margin-top:8px"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span> <strong>Hor\xE1rio de sa\xEDda</strong> n\xE3o preenchido.</div>';
  g('cfg-msg').innerHTML=warn;
  if(warn)setTimeout(()=>g('cfg-msg').innerHTML='',6000);
}

// v4.3.3: Gerenciamento de tags configur\xe1veis
function renderTagsConfig(){
  const el=g('tags-config-list');if(!el)return;
  el.innerHTML=_tags.map((t,i)=>{
    const paletteHtml=TAG_PALETTE.map(c=>'<span class="tag-color-opt'+(c===t.color?' sel':'')+'" style="background:'+c+'" data-color="'+c+'" onclick="setTagColor('+i+',&quot;'+c+'&quot;)"></span>').join('');
    return '<div class="tag-cfg-item" style="border-left:3px solid '+t.color+';padding:8px 10px;margin-bottom:6px;border-radius:var(--r);background:var(--sf);border:1px solid var(--bd);border-left:3px solid '+t.color+'">'
      +'<div style="display:flex;align-items:center;gap:8px">'
        +'<span style="width:14px;height:14px;border-radius:50%;background:'+t.color+';flex-shrink:0"></span>'
        +'<input type="text" value="'+t.label+'" style="flex:1;border:none;background:transparent;font-size:13px;font-weight:600;color:var(--tx);outline:none" onchange="setTagLabel('+i+',this.value)"/>'
        +'<button class="bic del" style="width:20px;height:20px;font-size:10px;flex-shrink:0" onclick="removeTag('+i+')">\u2715</button>'
      +'</div>'
      +'<div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">'+paletteHtml+'</div>'
    +'</div>';
  }).join('');
}
function setTagColor(idx,color){_lastLocalChange=Date.now();_tagsUpdatedAt=Date.now();_tags[idx].color=color;_saveTags();renderTagsConfig();renderC();_syncPushDebounced();}
function setTagLabel(idx,label){_lastLocalChange=Date.now();_tagsUpdatedAt=Date.now();_tags[idx].label=label.trim()||_tags[idx].label;_saveTags();updateTagSelects();_reapplyTagsToClients();renderC();_syncPushDebounced();}
function removeTag(idx){
  if(_tags.length<=0){toast(t('tag.none_available'),'warn');return;}
  _lastLocalChange=Date.now();_tagsUpdatedAt=Date.now();
  const removedId=_tags[idx].id;
  _tags.splice(idx,1);_saveTags();
  // Migrar clientes com a tag removida para array vazio
  clients.forEach(c=>{if(Array.isArray(c.tipo))c.tipo=c.tipo.filter(t=>t!==removedId);else if(c.tipo===removedId)c.tipo=[];});
  renderTagsConfig();updateTagSelects();renderC();_syncPushDebounced();
}
function addNewTag(){
  if(_tags.length>=10){toast(t('tag.max_10'),'warn');return;}
  _lastLocalChange=Date.now();_tagsUpdatedAt=Date.now();
  const usedColors=_tags.map(t=>t.color);
  const availColor=TAG_PALETTE.find(c=>!usedColors.includes(c))||TAG_PALETTE[_tags.length%TAG_PALETTE.length];
  const id='tag_'+Date.now();
  _tags.push({id,label:'Nova tag',color:availColor});
  _saveTags();renderTagsConfig();updateTagSelects();_reapplyTagsToClients();_syncPushDebounced();
}
function updateTagSelects(){
  // Atualizar todos os multi-selects de tipo no sistema
  ['f-tipo','em-tipo','si-tipo'].forEach(selId=>{
    renderTagMultiSelect(selId);
  });
}

let _goPageFromPop=false;
function goPage(p,el){if(_isMotoristaMode)return;window.scrollTo(0,0);window.scrollTo(0,0);
  // v4.3.7 / v5.4.0: Fechar mapa fullscreen ao navegar (inclusive ao clicar no logo estando em rota)
  if(mapIsFullscreen){toggleMapFullscreen();}
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.ntab').forEach(x=>x.classList.remove('on'));
  g('page-'+p).classList.add('on');if(el)el.classList.add('on');
  // v4.6.3: Persist active tab
  localStorage.setItem('rota_active_tab',p);
  // v5.5.0: pushState para botao voltar funcionar no mobile
  if(!_goPageFromPop){history.pushState({page:p},'',null);}
  // v4.3.7: Botão salvar só visível na aba Configurações
  const saveBar=g('cfg-save-bar');if(saveBar)saveBar.style.display=p==='cfg'?'flex':'none';
  // v5.8.35: Atualizar lista de endereços memorizados ao abrir Configurações
  if(p==='cfg')renderAddrChoices();
  // v4.5.1: Ao retornar para aba Rota, re-trigger resize + fitBounds no minimap
  if(p==='rota'&&gMap){
    setTimeout(()=>{
      google.maps.event.trigger(gMap,'resize');
      if(gMarkers.length){
        const bnds=new google.maps.LatLngBounds();
        gMarkers.forEach(m=>{const pos=m.position;if(pos)bnds.extend(pos);});
        gMap.fitBounds(bnds,{top:40,bottom:40,left:40,right:40});
        google.maps.event.addListenerOnce(gMap,'idle',()=>{if(gMap.getZoom()>16)gMap.setZoom(16);if(gMap.getZoom()<10)gMap.setZoom(10);});
      } else if(cfg.base&&cfg.base.trim()){
        (async()=>{try{const a=await _resolveGeoAnchor();if(a&&gMap){gMap.panTo({lat:a.lat,lng:a.lng});gMap.setZoom(12);}}catch(e){}})();
      }
    },200);
  }
  // v4.7.9: requestAnimationFrame para evitar freeze visual ao trocar aba
  // Permite o browser pintar a troca antes de executar render pesado
  if(p==='dash')requestAnimationFrame(()=>renderDash());
  if(p==='motor')requestAnimationFrame(()=>{renderMotor();if(!_isMotoristaMode&&_currentRouteId&&_cloudVersion>0)startGestorPolling();});
  if(p==='hist'){requestAnimationFrame(()=>renderHist());const _now=Date.now();if(!window._lastHistSync||_now-window._lastHistSync>60000){window._lastHistSync=_now;_syncPull().catch(()=>{});}}
  if(p==='adm')requestAnimationFrame(()=>_admInit());
}
/* v5.5.0: Botao voltar do mobile navega entre abas em vez de sair do app */
window.addEventListener('popstate',function(e){
  /* v5.5.2: fix 9 — fecha hist-modal antes de navegar entre abas */
  const _histModal=g('hist-modal');
  if(_histModal&&_histModal.classList.contains('on')){
    _histModal.classList.remove('on');
    return;
  }
  if(e.state&&e.state.page){
    _goPageFromPop=true;
    const tabs=document.querySelectorAll('.ntab');
    const tabMap={rota:0,hist:1,dash:2,motor:3,cfg:4,adm:5};
    goPage(e.state.page,tabs[tabMap[e.state.page]]||null);
    _goPageFromPop=false;
  }
});
/* Inicializar state para a pagina atual */
history.replaceState({page:localStorage.getItem('rota_active_tab')||'rota'},'',null);

function stab(n,el){
  document.querySelectorAll('.tp').forEach(x=>{x.style.opacity='0';x.classList.remove('on');});
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));
  const target=g('tp-'+n);
  target.classList.add('on');
  requestAnimationFrame(()=>{target.style.opacity='1';});
  el.classList.add('on');
  if(n==='man')g('cform').style.display='block';
  else if(n==='trello')g('cform').style.display='none';
  else if(n==='file')g('cform').style.display='none'; // v4.7.0: file tab has its own flow
  // v4.3.9: Save preferred tab
  localStorage.setItem('rota_preferred_tab',n);
}
// v4.3.9: Pin/favorite tab system
function initPreferredTab(){
  const pref=localStorage.getItem('rota_preferred_tab');
  if(pref){
    const tabs=document.querySelectorAll('.tab');
    const tabMap={trello:0,img:1,file:2,man:3}; // v4.7.0: file tab added
    const idx=tabMap[pref];
    if(idx!==undefined&&tabs[idx]){
      stab(pref,tabs[idx]);
    }
  }
  // Add pin indicators to tabs
  updateTabPins();
}
function updateTabPins(){
  const pref=localStorage.getItem('rota_preferred_tab');
  document.querySelectorAll('.tab').forEach(t=>{
    const existing=t.querySelector('.tab-pin');
    if(existing)existing.remove();
  });
  if(pref){
    const tabMap={trello:0,img:1,file:2,man:3}; // v4.7.0: file tab added
    const idx=tabMap[pref];
    const tabs=document.querySelectorAll('.tab');
    if(idx!==undefined&&tabs[idx]){
      const pin=document.createElement('span');
      pin.className='tab-pin';
      pin.innerHTML='<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="5"/></svg>';
      pin.style.cssText='margin-left:4px;color:var(--pu);opacity:.6;display:inline-flex;vertical-align:middle';
      tabs[idx].appendChild(pin);
    }
  }
}


function toggleFValTipo(){
  const vt=g('f-valtipo')?.value||'normal';
  if(g('f-val-wrap'))g('f-val-wrap').style.display=vt==='normal'?'':'none';
}
function toggleJanela(){
  const c=v('f-janela')==='custom';
  g('hi-wrap').style.display=c?'':'none';
  g('hf-wrap').style.display=c?'':'none';
}
function toggleSiValTipo(){
  const vt=document.getElementById('si-valtipo')?.value||'normal';
  const w=document.getElementById('si-val-wrap');if(w)w.style.display=vt==='normal'?'':'none';
}
function toggleSiJanela(){
  const c=document.getElementById('si-janela')?.value==='custom';
  const hw=document.getElementById('si-hi-wrap'),fw=document.getElementById('si-hf-wrap');
  if(hw)hw.style.display=c?'':'none';if(fw)fw.style.display=c?'':'none';
}
function resetForm(){
  ['f-nome','f-tel','f-cep','f-end','f-num','f-comp','f-qtd','f-val','f-obs','f-hi','f-hf'].forEach(id=>{const e=g(id);if(e)e.value='';});
  
  initTagMultiSelect('f-tipo',[]);g('f-janela').value='livre';if(g('f-valtipo')){g('f-valtipo').value='normal';toggleFValTipo();}
  g('f-data').value=new Date().toISOString().split('T')[0];
  g('ai-badge').style.display='none';g('amb-box').style.display='none';g('amb-box').innerHTML='';
  // v4.6.3: Also remove standalone CEP ambiguity alert
  const ambCepAlert=document.getElementById('amb-cep-alert');if(ambCepAlert)ambCepAlert.remove();
  toggleJanela();
}

function onFileSelect(e){if(e.target.files[0])processFile(e.target.files[0]);}
function processFile(f){
  const r=new FileReader();
  r.onload=e=>{imgData=e.target.result;g('prev-img').src=imgData;g('img-prev').style.display='block';g('upl').style.display='none';g('cform').style.display='block';};
  r.readAsDataURL(f);
}
function clearImg(){imgData=null;g('upl').style.display='';g('img-prev').style.display='none';g('file-in').value='';}


// ════════════════════════════════════════════════════════════
// SECTION: MULTI-IMPORT
// ════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════
// v4.7.0: MULTI-IMPORT (Excel / CSV / TSV)
// ═══════════════════════════════════════════
let _fileImportWB=null; // SheetJS workbook
let _fileImportData=[]; // parsed rows (array of objects)
let _fileImportCols=[]; // detected column headers
let _fileImportMap={}; // user column mapping {field: colName}
let _fileImportPreviewRows=[]; // validated rows ready to import

const _FI_FIELDS=[
  {key:'nome',label:'Nome',required:true,aliases:['nome','name','cliente','client','razao','razão','razao social','razão social']},
  {key:'endereco',label:'Endereço',required:true,aliases:['endereco','endereço','endereco completo','endereço completo','address','logradouro','rua','end']},
  {key:'cep',label:'CEP',required:false,aliases:['cep','zip','zipcode','codigo postal','código postal']},
  {key:'tel',label:'Telefone',required:false,aliases:['telefone','tel','fone','phone','celular','whatsapp','wpp','contato']},
  {key:'tipo',label:'Tipo (tag)',required:false,aliases:['tipo','type','servico','serviço','tag','categoria']},
  {key:'qtd',label:'Quantidade',required:false,aliases:['qtd','quantidade','qty','quantity','quant','pecas','peças','itens','items']},
  {key:'val',label:'Valor (R$)',required:false,aliases:['valor','val','value','preco','preço','price','total']},
  {key:'obs',label:'Observações',required:false,aliases:['obs','observacao','observação','observacoes','observações','notes','notas','info','complemento','comp']},
  {key:'data',label:'Data',required:false,aliases:['data','date','dia','agendamento']},
  {key:'janela',label:'Janela',required:false,aliases:['janela','horario','horário','window','periodo','período','turno']}
];

function onFileImportSelect(e){
  const f=e.target.files[0];
  if(!f)return;
  parseImportFile(f);
}

function parseImportFile(file){
  const ext=file.name.split('.').pop().toLowerCase();
  if(ext==='csv'||ext==='tsv'){
    const reader=new FileReader();
    reader.onload=e=>{
      const txt=e.target.result;
      const sep=ext==='tsv'?'\t':detectCSVSeparator(txt);
      const rows=parseCSVText(txt,sep);
      if(rows.length<2){toast(t('err.file_empty'),'err');return;}
      _fileImportCols=rows[0].map(c=>(c||'').toString().trim());
      _fileImportData=rows.slice(1).map(r=>{
        const obj={};
        _fileImportCols.forEach((c,i)=>{obj[c]=r[i]!==undefined?(r[i]||'').toString().trim():'';});
        return obj;
      }).filter(r=>Object.values(r).some(v=>v));
      _fileImportWB=null;
      showColumnMapping(file.name);
    };
    reader.readAsText(file,'UTF-8');
  }else{
    // Excel
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        _fileImportWB=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
        loadSheetData(_fileImportWB.SheetNames[0]);
        showColumnMapping(file.name);
      }catch(err){
        toast(t('err.excel_read')+': '+err.message,'err');
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

function detectCSVSeparator(txt){
  const firstLine=txt.split(/\r?\n/)[0]||'';
  const semiCount=(firstLine.match(/;/g)||[]).length;
  const commaCount=(firstLine.match(/,/g)||[]).length;
  const tabCount=(firstLine.match(/\t/g)||[]).length;
  if(tabCount>=semiCount&&tabCount>=commaCount)return '\t';
  if(semiCount>=commaCount)return ';';
  return ',';
}

function parseCSVText(txt,sep){
  const rows=[];let row=[];let cell='';let inQ=false;
  for(let i=0;i<txt.length;i++){
    const c=txt[i];
    if(inQ){
      if(c==='"'&&txt[i+1]==='"'){cell+='"';i++;}
      else if(c==='"'){inQ=false;}
      else{cell+=c;}
    }else{
      if(c==='"'){inQ=true;}
      else if(c===sep){row.push(cell);cell='';}
      else if(c==='\n'||c==='\r'){
        if(c==='\r'&&txt[i+1]==='\n')i++;
        row.push(cell);cell='';
        if(row.some(v=>v.trim()))rows.push(row);
        row=[];
      }else{cell+=c;}
    }
  }
  row.push(cell);
  if(row.some(v=>v.trim()))rows.push(row);
  return rows;
}

function loadSheetData(sheetName){
  if(!_fileImportWB)return;
  const ws=_fileImportWB.Sheets[sheetName];
  const json=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
  if(json.length<2){toast(t('err.sheet_empty'),'err');return;}
  _fileImportCols=json[0].map(c=>(c||'').toString().trim());
  _fileImportData=json.slice(1).map(r=>{
    const obj={};
    _fileImportCols.forEach((c,i)=>{obj[c]=r[i]!==undefined?(r[i]||'').toString().trim():'';});
    return obj;
  }).filter(r=>Object.values(r).some(v=>v));
}

function showColumnMapping(fileName){
  g('upl-file').style.display='none';
  g('file-import-map').style.display='block';
  g('file-import-preview').style.display='none';
  g('file-import-info').textContent=fileName+' \u2014 '+_fileImportData.length+' linhas encontradas';
  // Sheet selector for Excel
  if(_fileImportWB&&_fileImportWB.SheetNames.length>1){
    g('file-import-sheet-sel').style.display='block';
    const sel=g('file-import-sheet');
    sel.innerHTML=_fileImportWB.SheetNames.map(s=>'<option value="'+s+'">'+s+'</option>').join('');
  }else{
    g('file-import-sheet-sel').style.display='none';
  }
  // Auto-detect column mapping
  autoDetectColumns();
  renderColumnMap();
}

function onSheetChange(){
  loadSheetData(g('file-import-sheet').value);
  g('file-import-info').textContent=g('file-import-sheet').value+' \u2014 '+_fileImportData.length+' linhas';
  autoDetectColumns();
  renderColumnMap();
}

function autoDetectColumns(){
  _fileImportMap={};
  _FI_FIELDS.forEach(field=>{
    const match=_fileImportCols.find(col=>{
      const norm=col.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
      return field.aliases.some(a=>norm===a||norm.includes(a));
    });
    if(match)_fileImportMap[field.key]=match;
  });
}

function renderColumnMap(){
  const container=g('file-col-map');
  const sample=_fileImportData[0]||{};
  container.innerHTML=_FI_FIELDS.map(field=>{
    const opts=['<option value="">\u2014 Ignorar \u2014</option>'];
    _fileImportCols.forEach(col=>{
      const sel=_fileImportMap[field.key]===col?' selected':'';
      const preview=sample[col]?(sample[col].toString().substring(0,30)):'';
      opts.push('<option value="'+col.replace(/"/g,'&quot;')+'"'+sel+'>'+col+(preview?' ('+preview+')':'')+'</option>');
    });
    return '<div class="fi-map-row">'+
      '<span class="fi-col-src">'+(field.required?'\u2731 ':'')+field.label+'</span>'+
      '<span class="fi-arrow">\u2192</span>'+
      '<select onchange="onColMapChange(\''+field.key+'\',this.value)">'+opts.join('')+'</select>'+
    '</div>';
  }).join('');
}

function onColMapChange(fieldKey,colName){
  if(colName)_fileImportMap[fieldKey]=colName;
  else delete _fileImportMap[fieldKey];
}

function previewFileImport(){
  if(!_fileImportMap.nome){toast(t('e.mapname'),'err');return;}
  if(!_fileImportMap.endereco){toast(t('e.mapaddr'),'err');return;}
  // Build preview rows
  _fileImportPreviewRows=[];
  const errors=[];
  _fileImportData.forEach((row,i)=>{
    const nome=(row[_fileImportMap.nome]||'').trim();
    const endereco=(row[_fileImportMap.endereco]||'').trim();
    if(!nome&&!endereco)return; // skip empty
    const r={
      _row:i+2,
      nome:titleCase(nome),
      endereco:titleCase(endereco),
      cep:_fileImportMap.cep?(row[_fileImportMap.cep]||'').toString().replace(/\D/g,''):'',
      tel:_fileImportMap.tel?fmtTel((row[_fileImportMap.tel]||'').toString()):'',
      tipo:_fileImportMap.tipo?normalizeTipo((row[_fileImportMap.tipo]||'').toString()):['coleta'],
      qtd:_fileImportMap.qtd?Math.max(0,parseInt(row[_fileImportMap.qtd])||0):0,
      val:_fileImportMap.val?Math.max(0,parseFloat((row[_fileImportMap.val]||'0').toString().replace(',','.'))||0):0,
      obs:_fileImportMap.obs?(row[_fileImportMap.obs]||'').toString():'',
      data:_fileImportMap.data?parseImportDate((row[_fileImportMap.data]||'').toString()):new Date().toISOString().split('T')[0],
      janela:_fileImportMap.janela?parseJanela((row[_fileImportMap.janela]||'').toString()):'livre',
      _valid:true,_err:''
    };
    // Validate
    if(!r.nome){r._valid=false;r._err='Nome vazio';}
    else if(!r.endereco){r._valid=false;r._err='Endere\xE7o vazio';}
    else if(r.endereco.length<5){r._valid=false;r._err='Endere\xE7o muito curto';}
    if(!r._valid)errors.push('Linha '+(i+2)+': '+r._err);
    _fileImportPreviewRows.push(r);
  });
  if(!_fileImportPreviewRows.length){toast(t('err.no_valid'),'err');return;}
  // Show preview
  g('file-import-map').style.display='none';
  g('file-import-preview').style.display='block';
  const validCount=_fileImportPreviewRows.filter(r=>r._valid).length;
  const errCount=_fileImportPreviewRows.length-validCount;
  g('file-preview-count').textContent=validCount+' v\xE1lidos'+(errCount?' \u2022 '+errCount+' com problemas':'');
  g('file-import-count-btn').textContent='('+validCount+')';
  // Render table
  let html='<table class="fi-table"><thead><tr><th>#</th><th>Nome</th><th>Endere\xE7o</th><th>Tel</th><th>Tipo</th><th>Qtd</th><th>Valor</th>';
  if(_fileImportMap.obs)html+='<th>Obs</th>';
  html+='<th></th></tr></thead><tbody>';
  _fileImportPreviewRows.forEach((r,i)=>{
    const cls=r._valid?'':'fi-err';
    html+='<tr class="'+cls+'"><td>'+(i+1)+'</td><td>'+esc(r.nome)+'</td><td>'+esc(r.endereco)+'</td><td>'+esc(r.tel)+'</td><td>'+esc(Array.isArray(r.tipo)?r.tipo.join(', '):r.tipo)+'</td><td>'+r.qtd+'</td><td>'+fmtBRL(r.val)+'</td>';
    if(_fileImportMap.obs)html+='<td>'+esc(r.obs||'')+'</td>';
    html+='<td>'+(r._valid?'\u2705':'\u274C '+esc(r._err))+'</td></tr>';
  });
  html+='</tbody></table>';
  g('file-preview-table').innerHTML=html;
  // Errors box
  if(errors.length){
    g('file-preview-errors').style.display='block';
    g('file-preview-errors').innerHTML='<div class="ab w" style="font-size:12px"><strong>'+errors.length+' linhas com problemas</strong> (ser\xE3o ignoradas na importa\xE7\xE3o):<br>'+errors.slice(0,5).map(e=>esc(e)).join('<br>')+(errors.length>5?'<br>...e mais '+(errors.length-5):'')+'</div>';
  }else{
    g('file-preview-errors').style.display='none';
  }
}

function parseImportDate(str){
  if(!str)return new Date().toISOString().split('T')[0];
  // Try DD/MM/YYYY
  const br=/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/.exec(str.trim());
  if(br){
    let y=parseInt(br[3]);if(y<100)y+=2000;
    return y+'-'+br[2].padStart(2,'0')+'-'+br[1].padStart(2,'0');
  }
  // Try YYYY-MM-DD
  const iso=/^(\d{4})-(\d{2})-(\d{2})/.exec(str.trim());
  if(iso)return iso[1]+'-'+iso[2]+'-'+iso[3];
  // Excel serial
  const num=parseFloat(str);
  if(!isNaN(num)&&num>40000&&num<60000){
    const d=new Date((num-25569)*86400*1000);
    return d.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

function parseJanela(str){
  const s=str.toLowerCase().trim();
  if(s.includes('manh'))return 'manha';
  if(s.includes('tard'))return 'tarde';
  if(/\d{1,2}:\d{2}/.test(s))return 'custom';
  return 'livre';
}

function backToMapping(){
  g('file-import-preview').style.display='none';
  g('file-import-map').style.display='block';
}

function resetFileImport(){
  _fileImportWB=null;_fileImportData=[];_fileImportCols=[];_fileImportMap={};_fileImportPreviewRows=[];
  g('upl-file').style.display='';
  g('file-import-map').style.display='none';
  g('file-import-preview').style.display='none';
  g('file-import-in').value='';
}

function executeFileImport(){
  const valid=_fileImportPreviewRows.filter(r=>r._valid);
  if(!valid.length){toast(t('err.no_valid_import'),'err');return;}
  const today=new Date().toISOString().split('T')[0];
  let count=0;
  valid.forEach(r=>{
    clients.push({
      id:Date.now()+Math.random(),
      nome:_stripEmoji(r.nome), // v4.8.1: sanitizar emojis
      endereco:_stripEmoji(r.endereco),
      cep:r.cep||'',
      complemento:'',
      tel:r.tel||'',
      tipo:Array.isArray(r.tipo)?r.tipo:normalizeTipo(r.tipo),
      qtd:r.qtd||0,
      val:r.val||0,
      valTipo:r.val>0?'normal':'medir',
      data:r.data||today,
      janela:r.janela||'livre',
      hi:'',hf:'',
      obs:_stripEmoji(r.obs||''),
      estT:null,conflict:false,cmsg:'',lat:null,lng:null
    });
    preGeocode(clients[clients.length-1]); // v4.8.0: pre-geocoding em background
    count++;
  });
  order=clients.map((_,i)=>i);
  renderC();updStats();updBtns();
  toast(count+t('t.imported'),'ok');
  resetFileImport();
}

function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// Drag and drop for file import area
(function initFileImportDnD(){
  document.addEventListener('DOMContentLoaded',()=>{
    const upl=g('upl-file');
    if(!upl)return;
    upl.addEventListener('dragover',e=>{e.preventDefault();upl.classList.add('drag');});
    upl.addEventListener('dragleave',()=>{upl.classList.remove('drag');});
    upl.addEventListener('drop',e=>{
      e.preventDefault();upl.classList.remove('drag');
      if(e.dataTransfer.files[0])parseImportFile(e.dataTransfer.files[0]);
    });
  });
})();
// ═══════════════ END MULTI-IMPORT ═══════════════

async function extractImg(){
  if(!cfg.akey){toast(t('err.configure_ai'),'err');return;}
  if(!imgData)return;
  g('ext-btn').disabled=true;g('espin').style.display='';g('elbl').textContent='Extraindo...';
  try{
    const b64=imgData.split(',')[1],mt=imgData.split(';')[0].split(':')[1];
    const res=await fetch('https://roteiro-lavanderia.nigel-guandalini.workers.dev/api/anthropic',{method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({apiKey:cfg.akey,body:{model:'claude-sonnet-4-20250514',max_tokens:600,messages:[{role:'user',content:[
        {type:'image',source:{type:'base64',media_type:mt,data:b64}},
        {type:'text',text:'Analise esta imagem de conversa de WhatsApp sobre servico de lavanderia. Retorne APENAS JSON puro sem markdown.\nRegras:\n- "nome": nome completo do cliente (sem prefixo "Cliente")\n- "endereco": endereco COMPLETO em Title Case (rua, numero, complemento como apto/bloco, bairro, cidade). NAO inclua CEP no endereco.\n- "cep": CEP no formato NNNNN-NNN (8 digitos). NUNCA confunda com telefone\n- "telefone": apenas numero de telefone/celular com DDD (10-11 digitos). Se parecer CEP deixe vazio\n- "tipo": "coleta" se mencionar buscar/retirar/coleta; "entrega" se mencionar entregar/devolver; senao "vazio"\n- "qtd": quantidade de tapetes (inteiro, 0 se nao informado)\n- "valor": valor em reais\n- "janela": "livre","manha","tarde" ou "custom"\n- "hi"/"hf": horario inicio/fim se janela=custom (formato HH:MM)\n- "obs": observacoes relevantes apenas (nao inclua medidas de tapetes aqui)\nJSON: {"nome":"","endereco":"","cep":"","telefone":"","tipo":"vazio","qtd":0,"valor":0,"janela":"livre","hi":"","hf":"","obs":""}'}
      ]}]}})});
    const data=await res.json();
    let ext={};try{ext=JSON.parse((data.content?.[0]?.text||'{}').replace(/```json?|```/g,'').trim());}catch(e){}
    if(ext.nome)g('f-nome').value=ext.nome;
    if(ext.telefone)g('f-tel').value=ext.telefone;
    if(ext.cep){g('f-cep').value=fmtCep(ext.cep);onCepInput('f');}
    if(ext.endereco){
      // v5.8.25: separar endereço extraído em logradouro/número/complemento
      const _ap=_parseAddrParts(ext.endereco);
      g('f-end').value=_ap.logr;
      if(g('f-num'))g('f-num').value=_ap.num;
      if(g('f-comp'))g('f-comp').value=_ap.comp;
    }
    // complemento agora faz parte do endereco completo
    if(ext.tipo)initTagMultiSelect('f-tipo',normalizeTipo(ext.tipo));
    if(ext.qtd)g('f-qtd').value=ext.qtd;
    if(ext.valor)g('f-val').value=ext.valor;
    if(ext.obs)g('f-obs').value=ext.obs;
    if(ext.janela){g('f-janela').value=ext.janela;toggleJanela();}
    if(ext.hi)g('f-hi').value=ext.hi;
    if(ext.hf)g('f-hf').value=ext.hf;
    g('ai-badge').style.display='inline-flex';
    if(ext.endereco)schedGeo();
    toast(t('t.extracted'),'ok');
  }catch(e){toast(t('e.extract'),'err');}
  finally{g('ext-btn').disabled=false;g('espin').style.display='none';g('elbl').textContent='\u2728 Extrair com IA';}
}


// ════════════════════════════════════════════════════════════
// SECTION: TRELLO
// ════════════════════════════════════════════════════════════

// TRELLO STEP BY STEP
// Busca dados do Trello via Netlify Function (sem CORS, seguro)
async function trelloAPICall(endpoint){
  const res=await fetch('https://roteiro-lavanderia.nigel-guandalini.workers.dev/api/trello',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({endpoint,key:cfg.tkey,token:cfg.ttoken})
  });
  if(!res.ok){
    const err=await res.json().catch(()=>({error:'Erro desconhecido'}));
    throw new Error(err.error||'HTTP '+res.status);
  }
  return await res.json();
}

function trelloMainBtn(){
  if(selBoard&&selList){trelloBuscarCartoes();return;}
  trelloStep1();
}
async function trelloBuscarCartoes(){
  // Lê data do td2 (painel rápido) ou td (campo principal)
  const td2el=document.getElementById('td2');
  const dateVal=(td2el&&td2el.value)||v('td');
  if(!dateVal){toast(t('err.select_date'),'warn');return;}
  // Sincroniza o campo principal de data
  g('td').value=dateVal;
  saveTrelloSelection(); // v4.6.5: Persiste data selecionada
  g('trello-btn').disabled=true;g('tspin').style.display='';g('tlbl').textContent='Buscando...';
  g('trello-cards').innerHTML='';
  try{await trelloSelectList(selList.id,selList.name);}
  catch(e){toast(t('err.generic')+': '+e.message,'err');console.error(e);}
  finally{
    g('trello-btn').disabled=false;g('tspin').style.display='none';
    g('tlbl').innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> Buscar cart\xF5es';
  }
}
async function trelloStep1(){
  const key=cfg.tkey,token=cfg.ttoken;
  if(!key||!token){
    g('trello-nocred').style.display='block';
    g('trello-step1').style.display='none';
    toast(t('e.trello.cfg'),'err');return;
  }
  g('trello-nocred').style.display='none';
  g('trello-btn').disabled=true;g('tspin').style.display='';g('tlbl').textContent='Buscando...';
  try{
    const boards=await trelloAPICall('/members/me/boards?fields=name,id,desc');
    if(!Array.isArray(boards)||!boards.length){toast(t('err.no_boards'),'warn');return;}
    let html='';
    boards.forEach(b=>{
      const wasSel=selBoard&&selBoard.id===b.id;
      html+='<div class="sel-opt'+(wasSel?' on':'')+'" onclick="trelloSelectBoard(\''+b.id+'\',\''+b.name.replace(/'/g,"\\\'")+'\')">'
        +'<div class="sel-opt-icon" style="background:'+(wasSel?'var(--pu)':'var(--pul)')+'"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span></div>'
        +'<div><div style="font-weight:600;font-size:14px">'+b.name+(wasSel?' '+mi('check','mot-ico-sm'):'')+' </div>'+(b.desc?'<div style="font-size:12px;color:var(--mu);margin-top:2px">'+b.desc.slice(0,60)+'</div>':'')+'</div>'
        +'</div>';
    });
    _tboardsHtml=html;
    g('trello-boards').innerHTML=html;
    g('trello-step1').style.display='none';
    g('trello-step2').style.display='block';
  }catch(e){toast(t('err.fetch_boards')+': '+e.message,'err');console.error(e);}
  finally{g('trello-btn').disabled=false;g('tspin').style.display='none';g('tlbl').innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> Buscar quadros';}
}

async function trelloSelectBoard(id,name){
  selBoard={id,name};saveTrelloSelection();
  const key=cfg.tkey,token=cfg.ttoken;
  g('trello-boards').innerHTML='<div class="ab info">Buscando listas do quadro <strong>'+name+'</strong>... <span class="spin"></span></div>';
  try{
    const lists=await trelloAPICall('/boards/'+id+'/lists?fields=name,id&filter=open');
    if(!Array.isArray(lists)||!lists.length){toast(t('err.no_lists'),'warn');return;}
    let html='<div class="ab info" style="margin-bottom:12px"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span> Quadro: <strong>'+name+'</strong></div>';
    lists.forEach(l=>{
      html+='<div class="sel-opt" onclick="trelloSelectList(\''+l.id+'\',\''+l.name.replace(/'/g,"\\'")+'\')">'
        +'<div class="sel-opt-icon" style="background:var(--bll)"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span></div>'
        +'<div style="font-weight:600;font-size:14px">'+l.name+'</div>'
        +'</div>';
    });
    _tlistsHtml=html;
    g('trello-lists').innerHTML=html;
    g('trello-lists').style.display='block';
    g('trello-boards').style.display='none';
    g('trello-step2').style.display='none';
    g('trello-step3').style.display='block';
    g('tlbl').innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> Buscar cart\xF5es';
  }catch(e){
    toast(t('err.fetch_lists'),'err');console.error(e);
    // Restaura lista de quadros se falhar
    if(_tboardsHtml)g('trello-boards').innerHTML=_tboardsHtml;
    else g('trello-boards').innerHTML='<div class="ab w">Erro ao buscar listas. Tente novamente.</div>';
  }
}

async function trelloSelectList(id,name){
  selList={id,name};saveTrelloSelection();
  const key=cfg.tkey,token=cfg.ttoken;
  const dateVal=v('td');
  g('trello-lists').innerHTML='<div class="ab info">Buscando cart\xF5es da lista <strong>'+name+'</strong>... <span class="spin"></span></div>';
  try{
    const cards=await trelloAPICall('/lists/'+id+'/cards?fields=name,desc,due,id');
    const filtered=Array.isArray(cards)?cards.filter(c=>c.due&&new Date(c.due).toLocaleDateString('en-CA')===dateVal):[];
    window._tcards=filtered;
    let html='<div class="ab info" style="margin-bottom:12px"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span> Lista: <strong>'+name+'</strong></div>';
    if(!filtered.length){
      html+='<div class="ab w">Nenhum cart\xE3o com data '+new Date(dateVal+'T12:00').toLocaleDateString('pt-BR')+' nesta lista.</div>';
    }else{
      // v4.3.2: Botão importar no TOPO (antes dos cartões) para listas grandes
      html+='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
        +'<p style="font-size:13px;font-weight:600;margin:0;color:var(--mu)">'+filtered.length+' cart\xE3o(s) encontrado(s)</p>'
        +'<button class="btn bp bsm" onclick="importTC()"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Importar selecionados</button>'
        +'</div>';
      filtered.forEach((c,i)=>{
        html+='<div class="tcc on" id="tc-'+i+'" onclick="togTC('+i+')">'
          +'<input type="checkbox" checked id="tch-'+i+'" onclick="event.stopPropagation()"/>'
          +'<div><div style="font-weight:600">'+c.name+'</div>'+(c.desc?'<div style="font-size:12px;color:var(--mu);margin-top:3px">'+c.desc.slice(0,100)+(c.desc.length>100?'...':'')+'</div>':'')+'</div>'
          +'</div>';
      });
    }
    g('trello-cards').innerHTML=html;
    g('trello-boards').style.display='none';
    g('trello-lists').style.display='none';
    g('trello-step3').style.display='none';
    g('trello-step4').style.display='block';
    g('trello-nav-bar').innerHTML=buildTrelloNavBar();
  }catch(e){toast(t('err.fetch_cards'),'err');console.error(e);}
}

// trelloBack e trelloBack2 removidos — substituídos por botões "Mudar Lista" e "Mudar Quadro" no nav bar

function togTC(i){
  const cb=g('tch-'+i),el=g('tc-'+i);
  cb.checked=!cb.checked;el.classList.toggle('on',cb.checked);
}

function importTC(){
  // v4.8.8: Não precisa mais de API key — parser programático
  const cards=(window._tcards||[]).filter((_,i)=>{const cb=g('tch-'+i);return cb&&cb.checked;});
  if(!cards.length){toast(t('err.select_card'),'warn');return;}
  if(clients.length>0){
    const sub=confirm('Já existem '+clients.length+' cliente(s) na rota.\n\nOK = Substituir tudo\nCancelar = Adicionar aos existentes');
    if(sub){clients=[];order=[];}
  }
  // Barra de progresso visual
  const total=cards.length;
  const progEl=document.createElement('div');
  progEl.id='import-progress';
  progEl.innerHTML='<div style="background:var(--sf);border:1px solid var(--bd);border-radius:var(--r);padding:16px;margin-bottom:12px">'
    +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
    +'<div class="spinner" style="width:18px;height:18px;border:2.5px solid var(--bd);border-top-color:var(--pu);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0"></div>'
    +'<span id="prog-text" style="font-size:13px;font-weight:600;color:var(--tx)">Processando 0 de '+total+'...</span>'
    +'</div>'
    +'<div style="background:var(--s2);border-radius:20px;height:8px;overflow:hidden">'
    +'<div id="prog-bar" style="height:100%;width:0%;background:var(--pu);border-radius:20px;transition:width .3s ease"></div>'
    +'</div>'
    +'<div id="prog-name" style="font-size:12px;color:var(--mu);margin-top:6px;font-style:italic"></div>'
    +'</div>';
  if(!document.getElementById('spin-style')){const st=document.createElement('style');st.id='spin-style';st.textContent='@keyframes spin{to{transform:rotate(360deg)}}';document.head.appendChild(st);}
  g('trello-cards').innerHTML='';g('trello-cards').appendChild(progEl);
  let count=0;
  function normalizeComplemento(raw){
    if(!raw)return '';
    let s=raw.trim();
    // Normaliza variações de "apartamento/apto/ap" para "Apto"
    s=s.replace(/^(apartamento|apto\.?|ap\.?)\s*/i,'Apto ');
    // Normaliza "bloco/bl/blc" para "Bloco"
    s=s.replace(/^(bloco|bl\.?|blc\.?)\s*/i,'Bloco ');
    // Normaliza "andar"
    s=s.replace(/^(andar)\s*/i,'Andar ');
    // Normaliza "casa"
    s=s.replace(/^(casa)\s*/i,'Casa ');
    // Garante primeira letra maiúscula
    s=s.charAt(0).toUpperCase()+s.slice(1);
    return s.trim();
  }
  // v4.8.8: PARSER PROGRAMÁTICO — substitui Anthropic API (custo zero, <1ms/card)
  // IA fica APENAS para importação por imagem
  function parseCardProgrammatic(card){
    const title=(card.name||'').trim();
    const desc=(card.desc||'').trim();
    const fullText=title+'\n'+desc;

    // ── TIPO (coleta/entrega) ──
    let tipo='coleta';
    const tipoMatch=title.match(/\((entrega|coleta|devoluc[aã]o|retirada)\)/i)
      ||title.match(/\b(entrega|devoluc[aã]o)\b/i);
    if(tipoMatch){
      const t=tipoMatch[1].toLowerCase();
      tipo=(t==='entrega'||t.startsWith('devoluc'))?'entrega':'coleta';
    }

    // ── VALOR e VALORTIPO ──
    let valor=0,valorTipo='normal';
    const valMedir=title.match(/\bvalor\s+medir\b/i)||desc.match(/\bvalor\s+medir\b/i);
    const valPago=title.match(/\bvalor\s+pago\b/i)||desc.match(/\bvalor\s+pago\b/i);
    if(valMedir){valorTipo='medir';}
    else if(valPago){valorTipo='pago';}
    else{
      const vm=title.match(/\bvalor\s+(?:R\$\s*)?([\d.,]+)/i)||desc.match(/\bvalor\s+(?:R\$\s*)?([\d.,]+)/i);
      if(vm){valor=parseFloat(vm[1].replace('.','').replace(',','.'))||0;}
    }

    // ── TELEFONE ──
    let telefone='';
    const telRe=/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[\s.\-]?\d{4}/g;
    const telMatchesD=desc.match(telRe)||[];
    const telMatchesT=title.match(telRe)||[];
    const telAll=telMatchesD.concat(telMatchesT);
    if(telAll.length){
      let raw=telAll[0].replace(/\D/g,'');
      if(raw.length===13&&raw.startsWith('55'))raw=raw.slice(2);
      if(raw.length===11)telefone=raw.slice(0,2)+' '+raw.slice(2,7)+'-'+raw.slice(7);
      else if(raw.length===10)telefone=raw.slice(0,2)+' '+raw.slice(2,6)+'-'+raw.slice(6);
      else telefone=raw;
    }

    // ── QUANTIDADE ──
    let qtd=0;
    const qtdM=desc.match(/(\d+)\s*(?:tapetes?|pe[cç]as?|itens?|unid(?:ades?)?)/i)
      ||title.match(/(\d+)\s*(?:tapetes?|pe[cç]as?|itens?|unid(?:ades?)?)/i);
    if(qtdM)qtd=parseInt(qtdM[1],10)||0;

    // ── ENDEREÇO + COMPLEMENTO (v4.8.9: reescrita completa) ──
    const _abrevs=[
      [/\bAv\.\s?/gi,'Avenida '],[/\bAv[:\s]\s*/gi,'Avenida '], // v5.8.44: Av: com dois-pontos
      [/\bR\.\s?/gi,'Rua '],[/\bAl\.\s?/gi,'Alameda '],
      [/\bDr\.\s?/gi,'Doutor '],[/\bDr\s/gi,'Doutor '],
      [/\bProf\.\s?/gi,'Professor '],[/\bProf\s/gi,'Professor '],
      [/\bEng\.\s?/gi,'Engenheiro '],[/\bTrav\.\s?/gi,'Travessa '],
      [/\bP[cç]a\.?\s?/gi,'Pra\u00e7a '],[/\bSta\.\s?/gi,'Santa '],
      [/\bSto\.\s?/gi,'Santo '],[/\bN[\u00ba\u00b0]\s?/gi,'']
    ];
    // Regex amplo para complemento \u2014 detecta em QUALQUER linha, TODOS os padr\u00f5es
    const _compWords='apto?\\.?|apartamento|ap\\.?|bloco|bl\\.?|blc\\.?|andar|casa|sala|conj(?:unto)?\\.?|sobreloja|sobrado|fundos|cobertura|ed(?:if[i\u00ed]cio)?\\.?|torre|loja|kit(?:net)?|flat';
    const compRe=new RegExp('\\b((?:'+_compWords+')\\s*[\\d\\w\\/-]*)','i');
    const compReGlobal=new RegExp('\\b((?:'+_compWords+')\\s*[\\d\\w\\/-]*)','gi');

    // PASSO 1: Varrer TODAS as linhas e classificar cada uma
    let endereco='',complemento='';
    const lines=desc.split(/[\n\r]+/).map(l=>l.trim()).filter(Boolean);
    const lineRoles=[]; // track role of each line
    const compParts=[]; // acumular todos os fragmentos de complemento

    for(let li=0;li<lines.length;li++){
      const line=lines[li];
      // Telefone?
      if(/^(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[\s.\-]?\d{4}$/.test(line)){lineRoles[li]='tel';continue;}
      // Quantidade?
      if(/^\d+\s*(?:tapetes?|pe[c\u00e7]as?|itens?|unid)/i.test(line)){lineRoles[li]='qtd';continue;}
      // Valor?
      if(/^valor\s/i.test(line)){lineRoles[li]='valor';continue;}
      // Obs expl\u00edcita?
      if(/^obs[:\s]/i.test(line)){lineRoles[li]='obs';continue;}
      // Linha \u00e9 PURAMENTE complemento? (ex: "Apartamento 122", "Bloco B Apto 45")
      if(compRe.test(line)){
        const rest=line.replace(compReGlobal,'').replace(/[\s,\-\u2014]+/g,'').trim();
        if(rest.length<5){
          lineRoles[li]='comp';
          const cms=line.match(compReGlobal)||[];
          cms.forEach(c=>compParts.push(c.trim()));
          continue;
        }
      }
      // Endere\u00e7o? (logradouro ou CEP ou n\u00famero)
      // v5.8.44: Ignorar linhas que são APENAS o rótulo "CEP: XXXXX-XXX" — sem logradouro
      if(/^cep\s*:?\s*\d{5}-?\d{3}\s*$/i.test(line)){lineRoles[li]='unknown';continue;}
      // v5.8.44: Adicionar "av:" (com dois-pontos) ao detector de logradouro
      if(!endereco&&/(?:^(?:rua|r\.|av[.:\s]|avenida|alameda|al\.|travessa|trav\.|pra[c\u00e7]a|estrada|rod|viela|largo|beco)\b|\d{5}-?\d{3}|\b\d{1,5}\s*[-,])/i.test(line)){
        lineRoles[li]='addr';
        endereco=line;
        // Extrair complemento INLINE do endere\u00e7o
        const inlineComps=endereco.match(compReGlobal)||[];
        inlineComps.forEach(c=>compParts.push(c.trim()));
        if(inlineComps.length)endereco=endereco.replace(compReGlobal,'').replace(/,\s*,/g,',').replace(/,\s*[-\u2014]/g,' \u2014').replace(/[-\u2014][\s,]*[-\u2014]/g,'\u2014').replace(/[\s,\-\u2014]+$/,'').replace(/^\s*[,\-\u2014]\s*/,'').trim();
        continue;
      }
      lineRoles[li]='unknown';
    }

    // Se n\u00e3o achou endere\u00e7o por logradouro, pegar primeira linha n\u00e3o classificada >5 chars
    if(!endereco){
      for(let li=0;li<lines.length;li++){
        if(lineRoles[li]==='unknown'&&lines[li].length>5){
          lineRoles[li]='addr';
          endereco=lines[li];
          const inlineComps=endereco.match(compReGlobal)||[];
          inlineComps.forEach(c=>compParts.push(c.trim()));
          if(inlineComps.length)endereco=endereco.replace(compReGlobal,'').replace(/,\s*,/g,',').replace(/,\s*[-\u2014]/g,' \u2014').replace(/[-\u2014][\s,]*[-\u2014]/g,'\u2014').replace(/[\s,\-\u2014]+$/,'').replace(/^\s*[,\-\u2014]\s*/,'').trim();
          break;
        }
      }
    }

    // PASSO 1.5 (v4.9.1): Linha unknown logo após endereço = provável BAIRRO
    // Ex: "Praça Leonide Scavone 37" (addr) + "Vila Clementino" (unknown) → bairro
    if(endereco){
      const addrIdx=lineRoles.indexOf('addr');
      if(addrIdx>=0){
        for(let li=addrIdx+1;li<lines.length;li++){
          if(lineRoles[li]!=='unknown')continue;
          const line=lines[li];
          // Se a linha é curta (1-3 palavras), sem números longos, sem palavras-chave de outros campos → bairro
          const words=line.split(/\s+/);
          if(words.length<=4&&words.length>=1&&!/\d{4,}/.test(line)&&!/^\d+\s*(?:tapetes?|pe)/i.test(line)&&!/^valor/i.test(line)&&!/^obs/i.test(line)&&!compRe.test(line)){
            // Anexar como bairro ao endereço (será usado na montagem final)
            endereco=endereco+' - '+line;
            lineRoles[li]='bairro';
            break; // só pega 1 bairro
          }
          break; // se a próxima linha unknown não é bairro, para
        }
      }
    }

    // PASSO 2: Linhas 'unknown' \u2014 verificar se cont\u00e9m complemento antes de jogar pro obs
    for(let li=0;li<lines.length;li++){
      if(lineRoles[li]!=='unknown')continue;
      const cms=lines[li].match(compReGlobal);
      if(cms){
        cms.forEach(c=>compParts.push(c.trim()));
        lineRoles[li]='comp';
      }
    }

    // Montar complemento final (normaliza e deduplica)
    const compSet=new Set();
    compParts.forEach(c=>{const n=normalizeComplemento(c);if(n)compSet.add(n);});
    complemento=[...compSet].join(', ');

    // Extrair CEP do endere\u00e7o
    const cepM=endereco.match(/\b(\d{5}-?\d{3})\b/);
    if(cepM){endereco=endereco.replace(cepM[0],'').replace(/[\s,\-\u2014:]+$/,'').replace(/^[\s,\-\u2014:]+/,'').trim();if(/^cep$/i.test(endereco))endereco='';} // v5.8.44: limpa rótulo 'CEP' quando sobra

    // Expandir abreviações
    for(const [re,rep] of _abrevs)endereco=endereco.replace(re,rep);
    endereco=endereco.replace(/,\s*,/g,',').replace(/\s{2,}/g,' ').trim();

    // PASSO 3: Estruturar endereço \u2014 "Logradouro, N\u00famero \u2014 Bairro, Cidade"
    let _p={l:'',n:'',b:'',c:''};
    // Padr\u00e3o 1: "Logradouro, Num - Bairro" (com v\u00edrgula)
    const _ap1=endereco.match(/^(.+?)\s*,\s*(\d+\s*[A-Za-z]?)\s*[-\u2014]\s*(.+)$/);
    if(_ap1){
      _p.l=_ap1[1].trim();_p.n=_ap1[2].trim();
      const rest=_ap1[3].trim();
      const cs=rest.match(/^(.+?)\s*[,\-\u2014]\s*(.+)$/);
      if(cs){_p.b=cs[1].trim();_p.c=cs[2].trim();}else{_p.b=rest;}
    }else{
      // Padr\u00e3o 2: "Logradouro Num - Bairro" (sem v\u00edrgula)
      const _ap2=endereco.match(/^(.+?)\s+(\d+\s*[A-Za-z]?)\s*[-\u2014]\s*(.+)$/);
      if(_ap2){
        _p.l=_ap2[1].trim();_p.n=_ap2[2].trim();
        const rest=_ap2[3].trim();
        const cs=rest.match(/^(.+?)\s*[,\-\u2014]\s*(.+)$/);
        if(cs){_p.b=cs[1].trim();_p.c=cs[2].trim();}else{_p.b=rest;}
      }else{
        // Padr\u00e3o 3: "Logradouro Num Bairro" (tudo colado)
        const _ap3=endereco.match(/^(.+?)\s+(\d+\s*[A-Za-z]?)(?:\s+(.+))?$/);
        if(_ap3){_p.l=_ap3[1].trim();_p.n=_ap3[2].trim();if(_ap3[3])_p.b=_ap3[3].trim();}
        else{_p.l=endereco;}
      }
    }

    // Se _p.c contém complemento (capturado erroneamente como cidade), limpar — já está em complemento
    if(_p.c&&compRe.test(_p.c))_p.c='';
    // v5.8.44: Limpar qualificadores entre parênteses do bairro: 'Jardim Ipanema(zona Oeste)' → 'Jardim Ipanema'
    if(_p.b)_p.b=_p.b.replace(/\s*\([^)]*\)\s*/g,' ').replace(/\s{2,}/g,' ').trim();
    if(_p.c)_p.c=_p.c.replace(/\s*\([^)]*\)\s*/g,' ').replace(/\s{2,}/g,' ').trim();
    // v5.8.5: Logradouro, Número, Complemento — Bairro — Município
    let endFmt=titleCase(_p.l);
    if(_p.n)endFmt+=', '+_p.n;
    if(complemento)endFmt+=', '+complemento;
    if(_p.b){endFmt+=' \u2014 '+titleCase(_p.b);if(_p.c)endFmt+=' \u2014 '+titleCase(_p.c);}
    endereco=endFmt;

    // ── OBSERVA\u00c7\u00d5ES (v4.8.9: complemento NUNCA vai pro obs) ──
    let obs='';
    for(const line of lines){
      if(/^obs[:\s]/i.test(line)){obs=line.replace(/^obs[:\s]*/i,'').trim();break;}
    }
    // Coletar linhas realmente n\u00e3o consumidas (excluindo complemento)
    if(!obs){
      const extras=[];
      for(let li=0;li<lines.length;li++){
        if(lineRoles[li]&&lineRoles[li]!=='unknown')continue;
        const line=lines[li];
        if(compRe.test(line))continue;
        if(telAll.length&&telAll.some(t=>line.includes(t)))continue;
        if(qtdM&&line.includes(qtdM[0]))continue;
        if(line.length>3)extras.push(line);
      }
      if(extras.length)obs=extras.join('; ');
    }

    // ── JANELA DE HORÁRIO ──
    let janela='livre',hi='',hf='';
    const ft=fullText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    // "manhã", "até meio-dia", "até 12h"
    if(/\b(?:manha|ate\s+meio[\s\-]?dia|ate\s+(?:as?\s+)?12\s*h?)\b/.test(ft)){
      janela='manha';
    }
    // "à tarde", "após 12h", "depois do almoço"
    else if(/\b(?:a?\s*tarde|somente\s+tarde|apos\s+12\s*h?|depois\s+d[eo]\s+almoco)\b/.test(ft)){
      janela='tarde';
    }
    // "entre Xh e Yh" / "das X às Y"
    else if((function(){
      const m=ft.match(/(?:entre|das?)\s+(\d{1,2})(?::(\d{2}))?\s*h?\s*(?:e|as?|a|\-)\s*(\d{1,2})(?::(\d{2}))?\s*h?/);
      if(m){janela='custom';hi=m[1].padStart(2,'0')+':'+(m[2]||'00');hf=m[3].padStart(2,'0')+':'+(m[4]||'00');return true;}
      return false;
    })()){/* matched */}
    // "Xh-Yh"
    else if((function(){
      const m=ft.match(/(\d{1,2})(?::(\d{2}))?\s*h?\s*[\-–a]\s*(\d{1,2})(?::(\d{2}))?\s*h/);
      if(m){janela='custom';hi=m[1].padStart(2,'0')+':'+(m[2]||'00');hf=m[3].padStart(2,'0')+':'+(m[4]||'00');return true;}
      return false;
    })()){/* matched */}
    // "até Xh" / "antes das Xh"
    else if((function(){
      const m=ft.match(/(?:ate|antes\s+d[aeo]s?)\s+(?:as?\s+)?(\d{1,2})(?::(\d{2}))?\s*h?/);
      if(m&&!ft.includes('meio')){janela='custom';hi='07:00';hf=m[1].padStart(2,'0')+':'+(m[2]||'00');return true;}
      return false;
    })()){/* matched */}
    // "após Xh" / "depois das Xh" / "a partir das Xh"
    else if((function(){
      const m=ft.match(/(?:apos|depois\s+d[aeo]s?|a\s+partir\s+d[aeo]s?)\s+(?:as?\s+)?(\d{1,2})(?::(\d{2}))?\s*h?/);
      if(m){janela='custom';hi=m[1].padStart(2,'0')+':'+(m[2]||'00');hf='18:00';return true;}
      return false;
    })()){/* matched */}
    // "por volta das Xh" / "às Xh"
    else if((function(){
      const m=ft.match(/(?:por\s+volta\s+d[aeo]s?|as)\s+(\d{1,2})(?::(\d{2}))?\s*h?/);
      if(m){
        const h=parseInt(m[1],10);janela='custom';
        const mm=parseInt(m[2]||'0',10);
        const base=h*60+mm;
        const lo=Math.max(0,base-30),up=Math.min(1439,base+30);
        hi=String(Math.floor(lo/60)).padStart(2,'0')+':'+String(lo%60).padStart(2,'0');
        hf=String(Math.floor(up/60)).padStart(2,'0')+':'+String(up%60).padStart(2,'0');
        return true;
      }
      return false;
    })()){/* matched */}

    return {tipo,endereco,complemento,telefone,qtd,valor,valorTipo,janela,hi,hf,obs};
  }

  // v4.8.8: processCard usa parser programático (zero API, <1ms)
  function processCard(card){
    const _pc0=performance.now();
    const ext=parseCardProgrammatic(card);
    // Rejeitar card sem endereço
    if(!ext.endereco||!ext.endereco.trim()){
      throw new Error('Parser não encontrou endereço para: '+card.name.substring(0,40));
    }
    const dv=v('td')||new Date().toISOString().split('T')[0];
    const valTipo=ext.valorTipo==='medir'?'medir':ext.valorTipo==='pago'?'pago':'normal';
    let endFinal=ext.endereco||'';
    const nomeFmt=fmtNomeValor(card.name,ext.valor||0,valTipo);
    // v5.4.2: Auto-detectar tags configuradas pelo usuário — busca label da tag no texto do cartão
    const _cardNorm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const cardText=_cardNorm((card.name||'')+' '+(card.desc||''));
    const matchedTags=_tags.filter(tag=>{
      const lbl=_cardNorm(tag.label);
      if(!lbl)return false;
      // word-boundary: não casar "coletas" se a tag é "coleta" quando é parte de outra palavra não relacionada
      return new RegExp('\\b'+lbl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(cardText);
    }).map(tag=>tag.id);
    // Fallback: usar tipo detectado pelo parser se nenhuma tag casou
    const tipoFinal=matchedTags.length?matchedTags:normalizeTipo(ext.tipo||'coleta');
    const newClient={id:Date.now()+Math.random(),nome:_stripEmoji(nomeFmt),endereco:_stripEmoji(endFinal),complemento:'',tel:ext.telefone||'',tipo:tipoFinal,qtd:ext.qtd||0,val:ext.valor||0,valTipo,data:dv,janela:ext.janela||'livre',hi:ext.hi||'',hf:ext.hf||'',obs:_stripEmoji(ext.obs||''),estT:null,conflict:false,cmsg:'',lat:null,lng:null,_cidade:null};
    // Fire-and-forget: geocodifica em background
    if(endFinal)preGeocode(newClient);
    console.log('[TRELLO-IMPORT] processCard: '+Math.round(performance.now()-_pc0)+'ms — '+card.name.substring(0,30)+(matchedTags.length?' tags:'+matchedTags.join(','):''));
    return newClient;
  }
  // v4.8.8: IMPORTAÇÃO SÍNCRONA — parser programático, zero API
  const _impPerf={start:performance.now(),batchTimes:[]};
  console.log('[TRELLO-IMPORT] >>> Iniciando importação de '+cards.length+' cartões (parser programático)');
  // v4.8.8: Processa todos de uma vez (síncrono, <1ms/card)
  for(let i=0;i<cards.length;i++){
    try{
      const result=processCard(cards[i]);
      clients.push(result);count++;
    }catch(e){
      console.warn('[IMPORT] Card falhou:',e.message,'—',cards[i].name.substring(0,30));
    }
    g('prog-text').textContent='Processando '+(i+1)+' de '+total+'...';
    g('prog-bar').style.width=Math.round((i+1)/total*100)+'%';
    g('prog-name').textContent=cards[i].name.split(/\s*[\(\)]\s*/)[0].replace(/^cliente\s*/i,'').trim();
    renderC();updStats();
  }
  order=clients.map((_,i)=>i);renderC();updStats();updBtns();
  sessionStorage.removeItem('rota_user_cleared'); // v5.4.7: nova importação libera restore
  // v4.8.8: Log final de performance (parser programático)
  const _impTotal=Math.round(performance.now()-_impPerf.start);
  console.log('[TRELLO-IMPORT] === TOTAL: '+_impTotal+'ms ('+cards.length+' cartões, '+count+' importados, parser programático) ===');
  console.log('[TRELLO-IMPORT] Média/cartão: '+Math.round(_impTotal/cards.length)+'ms');
  toast(count+t('t.clients_imported'),'ok');
  g('trello-nav-bar').innerHTML=buildTrelloNavBar();
  g('trello-cards').innerHTML='<div class="ab ok"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> '+count+' cliente(s) importado(s)!</div>';
  // v5.8.14: Auditoria pós-importação — detecta endereços ambíguos sem precisar de F5
  // Delay de 700ms garante que todos os preGeocode (cache hits: sub-ms) já resolveram.
  // Usa _runStoredGeoAudit() — o mesmo caminho provado que funciona após F5.
  // Novos clientes têm IDs novos, logo não estão no cache de sessão e serão auditados.
  setTimeout(()=>_runStoredGeoAudit(),700);
}

// v5.2.0: OAuth do Trello — server-side key via Worker
async function connectTrelloOAuth(){
  // Se tem key manual no cfg, usa direto (modo avançado)
  if(cfg.tkey&&cfg.tkey!=='a1b2c3d4e5f6'){
    const returnUrl=window.location.origin+window.location.pathname;
    const authUrl='https://trello.com/1/authorize?expiration=never&name=Roteiro+de+Coleta&scope=read&response_type=token&key='+cfg.tkey+'&return_url='+encodeURIComponent(returnUrl+'?trello_auth=1');
    _openTrelloPopup(authUrl);return;
  }
  // Busca auth URL do Worker (key server-side)
  try{
    const returnUrl=window.location.origin+window.location.pathname;
    const res=await fetch(WORKER_URL+'/api/trello/auth-url?return_url='+encodeURIComponent(returnUrl));
    const d=await res.json();
    if(!d.ok||!d.authUrl){toast(d.error||'Erro ao conectar Trello. Tente config manual.','warn');return;}
    // Salva a key do server no cfg pra uso no proxy
    if(d.key){cfg.tkey=d.key;localStorage.setItem('rota_cfg',JSON.stringify(cfg));}
    _openTrelloPopup(d.authUrl);
  }catch(e){toast('Sem conexao com o servidor. Tente config manual.','warn');}
}
function _openTrelloPopup(authUrl){
  const popup=window.open(authUrl,'trello_auth','width=600,height=700,scrollbars=yes');
  const checkPopup=setInterval(()=>{
    try{
      if(!popup||popup.closed){
        clearInterval(checkPopup);
        /* v5.5.2: fix 2 — no mobile o popup pode redirecionar como nova aba; re-lê cfg do localStorage */
        const fresh=safeJsonParse('rota_cfg',{});
        if(fresh.ttoken&&fresh.ttoken!==cfg.ttoken){
          cfg.ttoken=fresh.ttoken;
          if(fresh.tkey)cfg.tkey=fresh.tkey;
          const el=document.getElementById('cfg-ttoken');if(el)el.value=cfg.ttoken;
          checkTrelloConnection();
          toast(t('t.trelloconn'),'ok');
        }
        return;
      }
      const pUrl=popup.location.href;
      if(pUrl.includes('token=')){
        const token=pUrl.match(/token=([^&]+)/)?.[1];
        if(token){
          cfg.ttoken=token;
          localStorage.setItem('rota_cfg',JSON.stringify(cfg));
          document.getElementById('cfg-ttoken').value=token;
          popup.close();
          clearInterval(checkPopup);
          checkTrelloConnection();
          _syncPushDebounced();
          toast(t('t.trelloconn'),'ok');
        }
      }
    }catch(e){/* cross-origin — esperado enquanto ainda está no Trello */}
  },500);
}
function disconnectTrello(){
  cfg.tkey='';cfg.ttoken='';
  localStorage.setItem('rota_cfg',JSON.stringify(cfg));
  document.getElementById('cfg-tkey').value='';
  document.getElementById('cfg-ttoken').value='';
  document.getElementById('trello-connected').style.display='none';
  document.getElementById('trello-not-connected').style.display='block';
  toast(t('t.trellodisc'),'');
}
async function checkTrelloConnection(){
  if(!cfg.ttoken){
    document.getElementById('trello-connected').style.display='none';
    document.getElementById('trello-not-connected').style.display='block';
    return;
  }
  try{
    const me=await trelloAPICall('/members/me?fields=fullName,username');
    if(me?.fullName){
      document.getElementById('trello-connected').style.display='block';
      document.getElementById('trello-not-connected').style.display='none';
      document.getElementById('trello-user-info').textContent=me.fullName+' (@'+me.username+')';
    }
  }catch(e){
    document.getElementById('trello-connected').style.display='none';
    document.getElementById('trello-not-connected').style.display='block';
  }
}
// Verificar conexão Trello ao carregar configs
window.addEventListener('load',()=>{setTimeout(checkTrelloConnection,500);});
// Verificar se voltou do OAuth com token na URL
(function(){
  const hash=window.location.hash;
  if(hash.includes('token=')){
    const token=hash.match(/token=([^&]+)/)?.[1];
    if(token){
      const c=safeJsonParse('rota_cfg',{});
      c.ttoken=token;
      localStorage.setItem('rota_cfg',JSON.stringify(c));
      window.location.hash='';
      toast(t('t.trelloconn'),'ok');
    }
  }
})();

function saveTrelloSelection(){
  if(selBoard&&selList){
    const dateVal=v('td')||'';
    localStorage.setItem('rota_trello',JSON.stringify({board:selBoard,list:selList,date:dateVal})); // v4.6.5: persiste data selecionada
  }
}
function loadTrelloSelection(){
  const saved=safeJsonParse('rota_trello',null);
  if(saved?.board&&saved?.list){
    selBoard=saved.board;selList=saved.list;
    // v4.6.5: Restaurar data selecionada (se existir e não for futura demais)
    if(saved.date){g('td').value=saved.date;}
    showTrelloQuickPanel();
  }
}
function showTrelloQuickPanel(){
  if(!selBoard||!selList)return;
  g('trello-nav-bar').innerHTML=buildTrelloNavBar();
  g('trello-cards').innerHTML='';
  ['trello-step1','trello-step2','trello-step3'].forEach(id=>g(id).style.display='none');
  g('trello-step4').style.display='block';
  g('tlbl').innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> Buscar cart\xF5es';
}

async function reloadTrelloList(){
  const dv=document.getElementById('td2')?.value||v('td');
  if(!dv){toast(t('err.select_date'),'warn');return;}
  g('td').value=dv;
  if(selList)await trelloSelectList(selList.id,selList.name);
}

function buildTrelloNavBar(){
  if(!selBoard||!selList)return '';
  const dv=document.getElementById('td2')?.value||document.getElementById('td')?.value||new Date().toISOString().split('T')[0];
  return '<div style="border:1px solid var(--bd);border-radius:12px;padding:14px;margin-bottom:14px;background:var(--sf)">'
    +'<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;font-size:12px;color:var(--mu);font-weight:600">'
      +'<span class="mot-ico" style="opacity:.4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span> '
      +selBoard.name+' <span style="opacity:.4">&rsaquo;</span> '+selList.name
    +'</div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
      +'<div style="cursor:pointer" onclick="this.querySelector(\'input\').showPicker()"><input type="date" id="td2" value="'+dv+'" style="padding:7px 10px;border:1.5px solid var(--bd);border-radius:var(--r);font-size:13px;font-family:inherit;background:var(--sf);color:var(--tx);cursor:pointer;width:100%"/></div>'
      +'<div style="display:flex;gap:8px;align-items:center">'
        +'<button class="btn bp bsm" onclick="trelloBuscarCartoes()" style="white-space:nowrap;flex:1" title="Buscar cart\xF5es"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span> Buscar</button>'
        +'<button class="btn bo bsm" onclick="resetTrello()" style="white-space:nowrap" title="Escolher lista">'+mi('refresh')+' Lista</button>'
        +'<button class="btn bo bsm" onclick="resetTrelloFull()" style="white-space:nowrap" title="Escolher quadro">'+mi('building')+' Quadro</button>'
      +'</div>'
    +'</div>'
  +'</div>';
}
async function resetTrelloFull(){
  selBoard=null;selList=null;window._tcards=[];
  _tboardsHtml='';_tlistsHtml='';
  localStorage.removeItem('rota_trello');
  // Esconder tudo e usar step4 como container temporário
  ['trello-step1','trello-step2','trello-step3'].forEach(id=>g(id).style.display='none');
  g('trello-step4').style.display='block';
  g('trello-nav-bar').innerHTML='';
  g('trello-cards').innerHTML='<div class="ab info"><span class="spin"></span> Buscando quadros...</div>';
  try{
    const boards=await trelloAPICall('/members/me/boards?fields=name,id,desc');
    if(!Array.isArray(boards)||!boards.length){g('trello-cards').innerHTML='<div class="ab w">Nenhum quadro encontrado.</div>';return;}
    let html='<p style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--mu)">Selecione o quadro:</p>';
    boards.forEach(b=>{
      html+='<div class="sel-opt" onclick="trelloSelectBoard(\''+b.id+'\',\''+b.name.replace(/'/g,"\\\'")+'\')">'
        +'<div class="sel-opt-icon" style="background:var(--pul)"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span></div>'
        +'<div><div style="font-weight:600;font-size:14px">'+b.name+'</div>'+(b.desc?'<div style="font-size:12px;color:var(--mu);margin-top:2px">'+b.desc.slice(0,60)+'</div>':'')+'</div>'
        +'</div>';
    });
    _tboardsHtml=html;
    g('trello-cards').innerHTML=html;
  }catch(e){g('trello-cards').innerHTML='<div class="ab e">Erro: '+e.message+'</div>';console.error(e);}
}
function resetTrello(){
  selList=null;window._tcards=[];
  g('trello-nav-bar').innerHTML='';g('trello-cards').innerHTML='';
  if(selBoard){
    localStorage.setItem('rota_trello',JSON.stringify({board:selBoard,list:null}));
    ['trello-step1','trello-step2','trello-step4'].forEach(id=>g(id).style.display='none');
    if(_tlistsHtml){
      g('trello-lists').innerHTML=_tlistsHtml;
      g('trello-lists').style.display='block';
      g('trello-boards').style.display='none';
      g('trello-step3').style.display='block';
    } else {
      // _tlistsHtml não populado (sessão restaurada) — re-busca listas
      trelloSelectBoard(selBoard.id,selBoard.name);
    }
  } else {
    selBoard=null;localStorage.removeItem('rota_trello');
    g('trello-step1').style.display='block';
    ['trello-step2','trello-step3','trello-step4'].forEach(id=>g(id).style.display='none');
  }
}

// GEO AMBIGUITY
function schedGeo(){clearTimeout(geoT);geoT=setTimeout(typeof checkAmbWithCep==='function'?checkAmbWithCep:checkAmb,2500);} // v5.8.32: 1400→2500ms
async function checkAmb(){
  const addr=v('f-end');if(addr.length<8)return;
  const box=g('amb-box');
  try{
    const d=await _geocodeProxy('address='+encodeURIComponent(addr+_getAddrSuffix())+'&region=br'+_getAnchorBounds()+_getAnchorComponents());
    if(d&&d.status==='OK'&&d.results.length>1&&_hasGeoAmbiguity(d.results)){
      const mem=_addrChoiceGet(addr);
      if(mem){ambRes=[mem];ambSel=0;box.style.display='none';toast('\u2713 Endere\xE7o confirmado automaticamente ('+[mem.bairro,mem.cidade].filter(Boolean).join(', ')+')','ok');return;}
      ambRes=d.results.map(r=>_extractGeoResult(r));
      const SVG_WARN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      let html='<div class="ab w"><span class="mot-ico">'+SVG_WARN+'</span> <strong>Endere\xE7o amb\xEDguo</strong> \u2014 '+d.results.length+' locais encontrados. Selecione o correto:</div>';
      ambRes.forEach((r,i)=>{const loc=[r.bairro,r.cidade].filter(Boolean).join(' \u2014 ')||r.display;html+='<div class="ao" id="ao-'+i+'" onclick="selAmb('+i+')"><strong style="font-size:13px">'+loc+'</strong><div style="font-size:11px;color:var(--mu);margin-top:2px">'+r.display+'</div></div>';});
      box.innerHTML=html;box.style.display='block';
    } else {box.style.display='none';}
  }catch(e){box.style.display='none';}
}
function selAmb(i){
  document.querySelectorAll('.ao').forEach(a=>a.classList.remove('sel'));
  g('ao-'+i)?.classList.add('sel');ambSel=i;
  if(ambRes[i]){
    // v5.8.7: Salvar escolha na memória para uso futuro
    const addr=v('f-end');
    if(addr)_addrChoiceSave(addr,ambRes[i]);
    g('amb-box').style.display='none';
    const loc=[ambRes[i].bairro,ambRes[i].cidade].filter(Boolean).join(', ');
    toast(t('msg.addr_confirmed')+(loc?' ('+loc+')':''),'ok');
  }
}
function confirmAmb(){closeModal('amb-modal');ambRes=[];ambSel=-1;} // v4.6.3: don't overwrite address

// v5.8.7: Modal de seleção para clientes com _addrPending (importados em lote)
// v5.8.11: showAddrPicker — lazy load usa _findAllGeoLocations (12 queries exaustivas)
// Garante que TODOS os locais da rua sejam apresentados desde o primeiro clique
async function showAddrPicker(clientId){
  const c=clients.find(x=>x.id==clientId);if(!c||!c._addrPending)return;
  const modal=g('addr-picker-modal');if(!modal)return;
  g('addr-picker-title').textContent='Verificar endere\xE7o';
  // Se resultados ainda não foram carregados, buscar agora (lazy)
  if(!c._addrResults||!c._addrResults.length){
    g('addr-picker-content').innerHTML='<div style="padding:24px;text-align:center;color:var(--mu);font-size:13px">Buscando todos os locais poss\xedveis...</div>';
    modal.classList.add('on');
    const baseAddr=_extractBaseAddr(c.endereco);
    if(baseAddr){
      // v5.8.17: busca via ViaCEP — todos os locais para essa rua (passa cidade do cliente)
      const parts=c.endereco.split('\u2014').map(p=>p.trim()).filter(Boolean);
      const storedBairro=parts.length>=3?parts[parts.length-2]:(parts.length===2?'':'');
      const storedCidade=parts.length>=2?parts[parts.length-1]:(c._cidade||'');
      const allLocs=await _findAllGeoLocations(baseAddr,storedCidade);
      if(c.lat&&c.lng){
        const chosen={lat:c.lat,lng:c.lng,bairro:storedBairro,cidade:storedCidade,isStored:true};
        const others=allLocs.filter(loc=>_geoDistKm(loc,{lat:c.lat,lng:c.lng})>2)
          .sort((a,b)=>_geoDistKm({lat:c.lat,lng:c.lng},a)-_geoDistKm({lat:c.lat,lng:c.lng},b));
        if(others.length>0){c._addrResults=[chosen,...others];}
        else{
          delete c._addrPending;delete c._addrResults;
          modal.classList.remove('on');renderC();
          toast('Endere\xE7o verificado \u2014 sem locais alternativos encontrados','ok');return;
        }
      } else if(allLocs.length>1){
        c._addrResults=allLocs;
      } else {
        delete c._addrPending;delete c._addrResults;
        modal.classList.remove('on');renderC();
        toast('Endere\xE7o verificado \u2014 sem locais alternativos encontrados','ok');return;
      }
    } else {
      delete c._addrPending;delete c._addrResults;
      modal.classList.remove('on');renderC();
      toast('N\xe3o foi poss\xedvel verificar esse endere\xE7o','err');return;
    }
  }
  // v5.8.9: Verifica se results[0] é o local atual armazenado (isStored:true)
  const hasStoredOption=c._addrResults[0]&&c._addrResults[0].isStored;
  const baseDisplay=_extractBaseAddr(c.endereco)||c.endereco.split('\u2014')[0].trim();
  let html='<div style="padding:4px 0 16px;font-size:13px;color:var(--mu)">'
    +(hasStoredOption
      ?'A rua <strong>'+baseDisplay+'</strong> existe em mais de um lugar. Confirme qual \xe9 o correto para <strong>'+_stripEmoji(c.nome)+'</strong>:'
      :'Encontramos <strong>'+c._addrResults.length+' locais</strong> com esse endere\xE7o para <strong>'+_stripEmoji(c.nome)+'</strong>. Selecione o correto e o sistema vai lembrar dessa escolha.'
    )+'</div>';
  c._addrResults.forEach((r,i)=>{
    const loc=[r.bairro,r.cidade].filter(Boolean).join(' \u2014 ')||(r.display?r.display.split(',').slice(-2).join(',').trim():'Local desconhecido');
    const isCurrentStored=r.isStored===true;
    html+='<div class="addr-pick-opt'+(isCurrentStored?' addr-pick-opt-stored':'')+'" onclick="pickAddr(\''+clientId+'\','+i+')">'
      +(isCurrentStored?'<div class="addr-pick-badge-stored">Localiza\xE7\xe3o atual</div>':'')
      +'<div class="addr-pick-loc">'+loc+'</div>'
      +'<div class="addr-pick-full">'+(isCurrentStored?'Confirmar que est\xe1 correto':r.display||'')+'</div>'
      +'</div>';
  });
  g('addr-picker-content').innerHTML=html;
  modal.classList.add('on');
}
function pickAddr(clientId,i){
  const c=clients.find(x=>x.id==clientId);if(!c||!c._addrResults)return;
  const chosen=c._addrResults[i];
  // v5.8.34: Confirmar atual agora salva com type:'confirmed' → badge não volta em imports futuros
  if(chosen.isStored){
    _addrChoiceSave(c.endereco,{...chosen,type:'confirmed'},c.nome);
  } else {
    // Aplicar coordenadas do local alternativo escolhido e salvar permanentemente
    c.lat=chosen.lat;c.lng=chosen.lng;
    // v5.8.18: Reconstruir endereço preservando rua+número+complemento do original,
    // substituindo bairro/cidade pelos do local escolhido.
    // _fmtAddrFromGeo era falha: geocode por CEP não retorna streetNum → perdia nº 57.
    const origStreet=(c.endereco.split('\u2014')[0]||c.endereco).trim(); // "Rua São Manoel, 57, Apto 104"
    let newAddr=origStreet;
    if(chosen.bairro)newAddr+=' \u2014 '+titleCase(chosen.bairro);
    if(chosen.cidade)newAddr+=' \u2014 '+titleCase(chosen.cidade);
    c.endereco=newAddr;
    c._cidade=chosen.cidade||''; // sincroniza _cidade com a cidade do local escolhido
    _addrChoiceSave(c.endereco,{...chosen,type:'alt'},c.nome); // v5.8.16: type:'alt' / v5.8.33: clientName key
  }
  delete c._addrPending;delete c._addrResults;
  closeModal('addr-picker-modal');
  renderC();autoSaveRoute();
  const loc=[chosen.bairro,chosen.cidade].filter(Boolean).join(', ');
  toast('\u2713 Endere\xE7o confirmado'+(loc?' ('+loc+')':''),'ok');
  // Verificar se há mais pendentes — abrir próximo automaticamente
  const next=clients.find(x=>x._addrPending);
  if(next)setTimeout(()=>showAddrPicker(next.id),400);
}
function renderAddrChoices(){
  const el=g('addr-choices-list');if(!el)return;
  const data=_addrChoiceGetAll();
  const keys=Object.keys(data);
  if(!keys.length){el.innerHTML='<div style="color:var(--mu);font-size:13px;padding:12px 0">Nenhum endere\xE7o memorizado ainda.</div>';return;}
  el.innerHTML=keys.map(k=>{
    const v=data[k];
    const loc=[v.bairro,v.cidade].filter(Boolean).join(' \u2014 ')||v.rawAddr||k;
    const dt=v.chosenAt?new Date(v.chosenAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'}):'';
    return '<div class="addr-choice-row">'
      +'<div class="addr-choice-info">'
        +'<div class="addr-choice-loc">'+loc+'</div>'
        +'<div class="addr-choice-raw">'+(v.rawAddr||k)+(dt?' \u2014 '+dt:'')+'</div>'
      +'</div>'
      +'<button class="bic" onclick="_addrChoiceDel(\''+k+'\');renderAddrChoices()" title="Remover" style="width:28px;height:28px;flex-shrink:0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>'
    +'</div>';
  }).join('');
}


function showConfirm(title,msg,onOk,onCancel,okLabel){
  g('confirm-title').textContent=title;
  g('confirm-msg').innerHTML=msg;
  // v4.6.3: customizable OK button label (default: "Confirmar")
  const okBtn=g('confirm-ok');
  okBtn.textContent=okLabel||t('btn.confirm');
  okBtn.onclick=()=>{closeModal('confirm-modal');onOk();};
  const cancelBtn=g('confirm-cancel');
  if(cancelBtn)cancelBtn.onclick=()=>{closeModal('confirm-modal');if(onCancel)onCancel();};
  g('confirm-modal').classList.add('on');
}
function addClient(){
  const nome=titleCase(v('f-nome')),tipos=getFormTags('f-tipo');
  // v5.8.25: monta endereço a partir dos campos separados
  const end=titleCase(buildFullAddr('f'));
  const logr=v('f-end').trim();
  if(!nome){toast(t('e.name'),'err');shakeField('f-nome');return;}
  if(!logr){toast(t('e.addr'),'err');shakeField('f-end');return;}
  if(!v('f-num').trim()){toast('Informe o n\u00famero do endere\u00e7o','err');shakeField('f-num','Número obrigatório');return;}
  if(end.length<6){toast(t('e.addrinv'),'err');return;}
  if(!tipos.length){toast(t('e.tag'),'err');return;}
  const qtd=parseInt(v('f-qtd'))||0;
  if(qtd<0){toast(t('err.qty_neg'),'err');return;}
  const valTipo=g('f-valtipo')?.value||'normal';
  const val=valTipo==='normal'?(parseFloat(v('f-val').replace(',','.'))||0):0;
  if(val<0){toast(t('err.val_neg'),'err');return;}
  const janela=g('f-janela').value;
  if(janela==='custom'){
    const hi=v('f-hi'),hf=v('f-hf');
    if(hi&&hf&&hi>=hf){toast(t('err.time_order'),'err');return;}
  }
  const cep=v('f-cep').replace(/\D/g,'');
  const newClient={id:Date.now()+Math.random(),nome,endereco:_normalizeAddrString(end),cep,complemento:'',tel:v('f-tel'),tipo:tipos,qtd,val,valTipo,data:v('f-data')||new Date().toISOString().split('T')[0],janela:g('f-janela').value,hi:v('f-hi'),hf:v('f-hf'),obs:v('f-obs'),estT:null,conflict:false,cmsg:'',lat:null,lng:null};
  clients.push(newClient);
  // v5.8.38: BUG-06/09 — avisa quando geocoding está em cooldown (verifica sem consumir slot)
  const _geoNow=Date.now();
  const _geoActive=_geoRateLog.filter(t=>_geoNow-t<60000).length;
  if(_geoActive>=_GEO_RATE_MAX){
    toast('Cliente adicionado sem geolocalização (limite temporário). Reabra o card para tentar novamente em instantes.','warn');
  }
  preGeocode(newClient); // v4.8.0: geocodificar em background imediatamente
  order=clients.map((_,i)=>i);
  resetForm();clearImg();renderC();updStats();updBtns();
  toast(nome+t('t.added'),'ok');
}
function removeC(id){
  const c=clients.find(x=>x.id===id);if(!c)return;
  showConfirm(t('confirm.delete_title'),t('confirm.remove_client',{name:c.nome}),()=>{
    clients=clients.filter(x=>x.id!==id);order=clients.map((_,i)=>i);renderC();updStats();updBtns();
    if(!clients.length)resetMap();
    else if(gRoute&&gMap)recalcRouteFromOrder(); // v5.8.31: atualiza marcadores e rota no mapa
    toast(t('t.removed'),'');
  });
}
// v4.6.5: Limpar todos os clientes da rota de uma vez
function clearAllClients(){
  if(!clients.length)return;
  const n=clients.length;
  showConfirm(t('confirm.clear_title'),t('confirm.clear_msg',{n}),()=>{
    // v5.8.26: cancelar TODOS os timers pendentes que poderiam restaurar clientes
    if(_gestorPollTimer){clearInterval(_gestorPollTimer);_gestorPollTimer=null;}
    clearTimeout(_autoSaveTimer);_autoSaveTimer=null;
    clearTimeout(_syncTimer);_syncTimer=null;
    _currentRouteId=null;_cloudVersion=0;_cloudHash='';
    // v5.8.26: atualizar _lastLocalChange para bloquear _syncPull por 5s
    _lastLocalChange=Date.now();
    // v5.4.7: flag na sessionStorage — impede restore no refresh desta sessão
    sessionStorage.setItem('rota_user_cleared','1');
    clients=[];order=[];
    localStorage.removeItem('rota_ativa');
    // v5.8.26: forçar push do estado vazio para o cloud (apaga activeRoute no servidor)
    _syncPushDebounced();
    renderC();updStats();updBtns();resetMap();
    toast(n+' '+t('cli.cli_removed',{n:n}),'ok');
  });
}
function toggleEmJanela(){
  const isCustom=g('em-janela').value==='custom';
  g('em-hi-wrap').style.display=isCustom?'':'none';
  g('em-hf-wrap').style.display=isCustom?'':'none';
}
function toggleEmValTipo(){
  const vt=g('em-valtipo').value;
  g('em-val-wrap').style.display=vt==='normal'?'':'none';
}
function editC(id){
  const c=clients.find(x=>x.id===id);if(!c)return;
  delete _geoCepLastAddr['em']; // v5.8.38: limpa cache para forçar re-geocodificação ao abrir modal
  g('em-id').value=id;
  g('em-nome').value=c.nome||'';
  g('em-cep').value=c.cep?fmtCep(c.cep):'';
  // v5.8.25: separar endereço em logradouro / número / complemento para edição
  const _ap=_parseAddrParts((c.endereco||'')+(c.complemento?' '+c.complemento:''));
  g('em-end').value=_ap.logr;
  g('em-num').value=_ap.num;
  g('em-comp').value=_ap.comp;
  g('em-tel').value=c.tel||'';
  
  initTagMultiSelect('em-tipo',normalizeTipo(c.tipo));
  g('em-qtd').value=c.qtd||'';
  g('em-valtipo').value=c.valTipo||'normal';
  g('em-val').value=c.val||0;
  g('em-val-wrap').style.display=(c.valTipo&&c.valTipo!=='normal')?'none':'';
  g('em-janela').value=c.janela||'livre';
  g('em-hi').value=c.hi||'';
  g('em-hf').value=c.hf||'';
  g('em-obs').value=c.obs||'';
  toggleEmValTipo();
  toggleEmJanela();
  g('edit-modal').classList.add('on');
  // v5.8.31: Auto-fill CEP — tenta extrair de c.obs (IA às vezes coloca lá), depois geocoda
  // v5.8.32: delay 3s para não disparar em aberturas rápidas do modal
  if(!c.cep){
    const obsMatch=(c.obs||'').match(/\b(\d{5})-?(\d{3})\b/);
    if(obsMatch){g('em-cep').value=fmtCep(obsMatch[1]+obsMatch[2]);}
    else if(c.endereco&&c.endereco.length>=8){setTimeout(()=>geocodeCepForPrefix('em'),3000);}
  }
}
function saveEditC(){
  const id=parseFloat(g('em-id').value);
  const c=clients.find(x=>x.id===id);if(!c)return;
  // v4.4.0: Apply Title Case on save
  const _emNome=g('em-nome').value.trim();
  // v5.8.25: montar endereço a partir dos campos separados
  const _emEndRaw=buildFullAddr('em');
  const _emEnd=_emEndRaw.trim();
  const _emObs=g('em-obs').value.trim();
  c.nome=_emNome?titleCase(_emNome):c.nome;
  const newCep=g('em-cep').value.replace(/\D/g,'');
  const newEnd=_emEnd?_normalizeAddrString(titleCase(_emEnd)):c.endereco;
  // v5.8.35: comparar só a base (sem sufixo — Bairro — Cidade) para não limpar geo ao editar outros campos
  const origBase=_normalizeAddrString(titleCase((c.endereco.split('\u2014')[0]||c.endereco).trim()));
  // v5.8.38: também comparar com newEnd sem vírgula de espaçamento para evitar falso-positivo
  const newEndNorm=newEnd.replace(/,\s*/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  const origBaseNorm=origBase.replace(/,\s*/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  const addrChanged=!!newEnd&&newEnd!==origBase&&newEndNorm!==origBaseNorm;
  const oldEndereco=c.endereco; // v5.8.26: guardar endereço antigo ANTES de sobrescrever
  c.endereco=addrChanged?newEnd:c.endereco; // v5.8.35: preservar sufixo se endereço não mudou
  c.complemento='';
  c.tel=g('em-tel').value.trim();
  if(addrChanged){
    // v5.8.26: limpar cache do endereço ANTIGO (não do novo)
    localStorage.removeItem('geo_'+oldEndereco);delete _geoCache[oldEndereco];
    c.lat=null;c.lng=null;c._cidade=null;c.cep=newCep||'';c.estT=null;c.conflict=false;c.cmsg='';
  }else{
    c.cep=newCep||c.cep;
  }
  c.tipo=getFormTags('em-tipo');
  c.qtd=parseInt(g('em-qtd').value)||0;
  c.valTipo=g('em-valtipo').value;
  c.val=c.valTipo==='normal'?parseFloat((g('em-val').value||'').replace(',','.'))||0:0;
  // Atualiza título do cartão com valor formatado
  c.nome=fmtNomeValor(c.nome,c.val,c.valTipo);
  c.janela=g('em-janela').value;
  c.hi=c.janela==='custom'?g('em-hi').value:'';
  c.hf=c.janela==='custom'?g('em-hf').value:'';
  c.obs=_emObs||'';
  if(c.janela==='custom'&&c.hi&&c.hf&&c.hi>=c.hf){toast(t('err.time_order'),'err');return;}
  closeModal('edit-modal');
  renderC();updStats();renderMotor();updateMapSidebar(); // v5.8.27: atualizar sidebar do mapa expandido
  if(addrChanged){
    // v5.8.25: reagendar geocodificação em background + recalcular rota quando tiver resultado
    toast(t('msg.client_updated')+' — reagendando endereço...','ok');
    nominatim(c.endereco,c).then(r=>{
      if(r){
        c.lat=r.lat;c.lng=r.lng;if(r.cidade)c._cidade=r.cidade;
        if(r.route){c.endereco=_fmtAddrFromGeo(r,c.endereco);}
        else if(r.bairro||r.cidade){
          const base=(c.endereco.split('\u2014')[0]||c.endereco).trim();
          let na=base;if(r.bairro)na+=' \u2014 '+titleCase(r.bairro);if(r.cidade)na+=' \u2014 '+titleCase(r.cidade);
          if(na!==c.endereco)c.endereco=na;
        }
        autoSaveRoute();renderC();
        // Se já temos rota gerada, recalcular com novo endereço
        if(_routeTotalMin>0&&gMap){recalcRouteFromOrder();}
      }
    }).catch(()=>{});
  }else{
    toast(t('msg.client_updated'),'ok');
  }
}

// v4.7.4: SVG inline icons para substituir emojis nos cards (M1 Monochrome)
const _icoPhone='<svg style="width:12px;height:12px;vertical-align:-1px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const _icoAlert='<svg style="width:13px;height:13px;vertical-align:-2px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
const _icoX='<svg style="width:11px;height:11px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
function renderC(){
  const el=g('clist');
  const clearBtn=g('clear-all-btn'); // v4.6.5
  if(!clients.length){el.innerHTML='<div class="empty"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg></span><p>'+t('cl.empty')+'</p></div>';g('cc-count').textContent='';g('cfl-banner').innerHTML='';if(clearBtn)clearBtn.style.display='none';return;}
  const cfls=clients.filter(c=>c.conflict);
  const coletasRisco=cfls.filter(c=>{const tipos=normalizeTipo(c.tipo);return tipos.length&&tipos.includes(_resolveTagId('coleta'));}).length;
  // v5.8.7: Banner de endereços pendentes de verificação
  const pendentes=clients.filter(c=>c._addrPending);
  const SVG_WARN_SM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  let bannerHtml='';
  // v5.8.41: banner para clientes sem geocodificação (excluídos do cálculo de rota)
  const semGeo=clients.filter(c=>!c.lat&&!c.lng&&!c._addrPending);
  if(semGeo.length)bannerHtml+='<div class="ab w" style="margin-bottom:8px;background:rgba(220,38,38,.07);border-color:rgba(220,38,38,.25)"><span class="mot-ico" style="color:#dc2626">'+SVG_WARN_SM+'</span> <div><strong style="color:#dc2626">'+semGeo.length+' cliente'+(semGeo.length>1?'s sem':'  sem')+' endere\xE7o localizado</strong><div style="font-size:12px;color:var(--mu);margin-top:2px">'+(semGeo.length>1?'Estes clientes n\xE3o ser\xE3o inclu\xEDdos no c\xE1lculo de rota.':'Este cliente n\xE3o ser\xE1 inclu\xEDdo no c\xE1lculo de rota.')+' Edite para corrigir o endere\xE7o.</div></div></div>';
  // v5.8.39: banner específico para paradas além do limite de retorno (separado do genérico de conflito)
  const retExceeded=cfls.filter(c=>c.cmsg&&c.cmsg.includes('limite de retorno'));
  const windowCfls=cfls.filter(c=>!c.cmsg||!c.cmsg.includes('limite de retorno'));
  if(retExceeded.length){const isDark=document.body.classList.contains('dark');bannerHtml+='<div class="ab w" style="margin-bottom:8px;background:'+(isDark?'rgba(245,158,11,.1)':'rgba(254,243,199,.8)')+';border-color:'+(isDark?'rgba(245,158,11,.3)':'#F59E0B')+';color:'+(isDark?'#FBBF24':'#92400E')+'"><span class="mot-ico" style="color:#f59e0b">'+SVG_WARN_SM+'</span> <div><strong>'+retExceeded.length+' parada'+(retExceeded.length>1?'s':'')+(retExceeded.length>1?' excedem':' excede')+' o limite de retorno ('+(cfg.ret||'17:00')+')</strong></div></div>';}
  if(windowCfls.length)bannerHtml+='<div class="ab w" style="margin-bottom:8px"><span class="mot-ico">'+SVG_WARN_SM+'</span> <div><strong>'+t('card.conflict',{n:windowCfls.length})+'</strong> '+t('card.risk',{n:coletasRisco})+'</div></div>';
  if(pendentes.length)bannerHtml+='<div class="ab" style="margin-bottom:8px;background:rgba(255,170,0,.08);border-color:rgba(255,170,0,.3);display:flex;align-items:center;gap:10px"><span class="mot-ico" style="color:#f59e0b">'+SVG_WARN_SM+'</span><div style="flex:1"><strong style="color:#92400e">'+pendentes.length+' endere\xE7o'+(pendentes.length>1?'s precisam':'precisa')+' de verifica\xE7\xE3o</strong><div style="font-size:12px;color:var(--mu);margin-top:2px">O sistema encontrou mais de 1 local com esse nome. Clique para escolher o correto.</div></div><button class="btn bp" style="flex-shrink:0;font-size:12px;padding:6px 12px" onclick="showAddrPicker(\''+pendentes[0].id+'\')">Revisar agora</button></div>';
  g('cfl-banner').innerHTML=bannerHtml;
  el.innerHTML=order.map((idx,stop)=>{
    const c=clients[idx];
    const tipos=normalizeTipo(c.tipo);
    const primaryColor=tipos.length?_getTagColor(tipos[0]):'rgba(108,92,231,.18)';
    const tagColor=primaryColor;
    const isCol=tipos.includes(_resolveTagId('coleta'));
    const jl={livre:'',manha:t('card.until_noon'),tarde:t('card.after_noon'),custom:c.hi+'\u2013'+c.hf}[c.janela]||'';
    const vd=c.valTipo==='medir'?t('form.medir'):c.valTipo==='pago'?t('form.pago'):c.val?'R$ '+fmtBRL(c.val):'';
    // v4.3.5: Multi-tags — borda listrada lado a lado (3px por tag)
    const bw=tagBorderWidth(tipos);
    const tagChips=renderTagChips(tipos);
    const typeClass=isCol?' col':tipos.includes(_resolveTagId('entrega'))?' ent':'';
    // 1 tag: border-left-color inline (CSS base tem border-left:3px solid). 2+ tags: div absoluto com faixas
    const cardStyle=tipos.length<=1?'border-left-color:'+tagColor:(tipos.length>1?'border-left:none;position:relative;padding-left:'+(13+bw)+'px;overflow:hidden':'');
    return '<div class="cc'+typeClass+(c.conflict&&isCol?' cfl':'')+(c.conflict&&!isCol?' cwn':'')+'" data-stop="'+stop+'" data-cid="'+c.id+'" style="'+cardStyle+'">'
      +(tipos.length>1?renderTagBorder(tipos):'')
      +'<div class="sn" style="background:'+tagColor+';color:#fff">'+(stop+1)+'</div>'
      +'<div class="ci">'
        +'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">'
          +'<span class="cn">'+_stripEmoji(c.nome)+'</span>'
          // v5.8.7: Badge de endereço pendente de verificação
          +(c._addrPending?'<button class="addr-pending-badge" onclick="event.stopPropagation();showAddrPicker(\''+c.id+'\')" title="Endere\xE7o amb\xEDguo \u2014 clique para verificar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> verificar</button>':'')
          // v5.8.38: Badge vermelho para clientes sem coordenadas (não serão roteados corretamente)
          // v5.8.44: badge clicável "sem localização" → retenta geocoding ao clicar
          +((!c.lat&&!c.lng&&!c._addrPending)?'<button class="addr-pending-badge" onclick="event.stopPropagation();_retryGeocode('+c.id+')" style="background:rgba(220,38,38,.1);color:#dc2626;border-color:rgba(220,38,38,.25)" title="Clique para tentar localizar novamente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="12"/><line x1="11" y1="16" x2="11.01" y2="16"/></svg> sem localiza\xE7\xE3o</button>':'')
          +(tagChips?'<div style="display:flex;gap:3px;flex-wrap:wrap;flex-shrink:0">'+tagChips+'</div>':'')
        +'</div>'
        +(c.endereco?'<div class="ca">'+fmtEnderecoComCidade(c)+'</div>':'')
        +'<div class="cm">'
          +(c.tel?'<span>'+_icoPhone+' '+c.tel+'</span>':'')
          +(c.qtd?'<span>'+c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':'')+'</span>':'')
          +(vd?'<span>'+vd+'</span>':'')
          +(jl?'<span>'+jl+'</span>':'')
          // v5.8.39: mostra "–" quando rota calculada mas cliente sem coordenadas (excluído do cálculo)
          +(c.estT?'<span class="et '+(c.conflict?'late':'')+'">'+t('card.arrival')+' '+c.estT+'</span>':(clients.some(x=>x.estT)&&!c.lat&&!c.lng?'<span class="et" style="color:var(--mu);opacity:.6">'+t('card.arrival')+' \u2013</span>':''))
        +'</div>'
        +(c.obs?'<div style="font-size:12px;color:var(--mu);margin-top:3px;font-style:italic">'+_stripEmoji(c.obs)+'</div>':'')
        +(c.conflict?'<div class="cmsg">'+_icoAlert+' '+c.cmsg+'</div>':'')
      +'</div>'
      +'<button class="bic del" style="width:28px;height:28px;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center" onclick="event.stopPropagation();removeC('+c.id+')">'+_icoX+'</button>'
      +'</div>';
  }).join('');
  g('cc-count').textContent=clients.length+' cliente'+(clients.length!==1?'s':'');
  if(clearBtn)clearBtn.style.display=clients.length>=2?'inline-block':'none'; // v4.6.5: Mostrar "Limpar todos" só com 2+ clientes
  // v4.3.2: Mostrar busca quando tem 5+ clientes
  const searchBox=g('client-search-box');
  if(searchBox)searchBox.style.display=clients.length>=5?'block':'none';
  initDragAndDrop();
  autoSaveRoute(); // v4.6.3: auto-save on every render
}
// v4.3.2: Filtro de clientes por nome/endereço
function filterClients(query){
  const q=query.toLowerCase().trim();
  const cards=document.querySelectorAll('#clist .cc[data-stop]');
  cards.forEach(card=>{
    const stop=parseInt(card.dataset.stop);
    const c=clients[order[stop]];
    if(!c){card.style.display='';return;}
    const match=!q||c.nome.toLowerCase().includes(q)||c.endereco.toLowerCase().includes(q)||(c.complemento||'').toLowerCase().includes(q)||(c.tel||'').includes(q);
    card.style.display=match?'':'none';
  });
}

// ---- DRAG AND DROP (card inteiro arrastável, detecção click vs drag) ----
let dragState=null;
const DRAG_THRESHOLD=8; // pixels mínimos pra considerar drag em vez de click
// v4.7.4: Event delegation — um listener no container em vez de N listeners nos cards
let _dragDelegated=false;
function initDragAndDrop(){
  const container=g('clist');if(!container)return;
  // v4.7.6: onclick removido do template — event delegation cuida de tudo
  if(_dragDelegated)return; // já delegado, não re-registrar
  _dragDelegated=true;
  let touchTimer=null,touchActive=false,touchCard=null;
  // v5.2.0: Track touch movement to distinguish scroll from tap
  let _touchStartY=0,_touchScrolled=false;
  container.addEventListener('mousedown',e=>{
    const card=e.target.closest('.cc[data-stop]');
    if(!card||e.target.closest('button')||e.target.closest('a'))return;
    e.preventDefault();
    initDragTracking(parseInt(card.dataset.stop),e.clientX,e.clientY,false,card);
  });
  container.addEventListener('touchstart',e=>{
    const card=e.target.closest('.cc[data-stop]');
    if(!card||e.target.closest('button')||e.target.closest('a'))return;
    const t=e.touches[0];
    touchActive=false;touchCard=card;
    _touchStartY=t.clientY;_touchScrolled=false;
    const stop=parseInt(card.dataset.stop);
    touchTimer=setTimeout(()=>{
      if(_touchScrolled)return; // v5.2.0: user scrolled, don't start drag
      touchActive=true;
      initDragTracking(stop,t.clientX,t.clientY,true,card);
      if(navigator.vibrate)navigator.vibrate(30);
    },300);
  },{passive:true});
  container.addEventListener('touchmove',e=>{
    if(!touchActive)clearTimeout(touchTimer);
    // v5.2.0: Detect scroll (>10px vertical movement)
    if(e.touches&&e.touches[0]&&Math.abs(e.touches[0].clientY-_touchStartY)>10){_touchScrolled=true;}
  },{passive:true});
  container.addEventListener('touchend',e=>{
    clearTimeout(touchTimer);
    // v5.2.0: Only open edit if it was a TAP (no scroll, no drag)
    if(!touchActive&&!dragState&&touchCard&&!_touchScrolled){
      const stop=parseInt(touchCard.dataset.stop);
      const idx=order[stop];
      if(idx!==undefined)editC(clients[idx].id);
    }
    touchCard=null;_touchScrolled=false;
  });
}
function initDragTracking(stopIdx,x,y,isTouch,card){
  // Rastrear movimento antes de iniciar o drag real
  dragState={stopIdx,startX:x,startY:y,isTouch,card,started:false,startTime:Date.now()};
  if(isTouch){
    document.addEventListener('touchmove',onDragTrack,{passive:false});
    document.addEventListener('touchend',onDragTrackEnd);
  } else {
    document.addEventListener('mousemove',onDragTrack);
    document.addEventListener('mouseup',onDragTrackEnd);
  }
}
function onDragTrack(e){
  if(!dragState)return;
  const touch=e.touches?e.touches[0]:e;
  const dx=touch.clientX-dragState.startX,dy=touch.clientY-dragState.startY;
  if(!dragState.started){
    if(Math.sqrt(dx*dx+dy*dy)>DRAG_THRESHOLD){
      // v4.7.3: Usar distância total (não apenas vertical) para detecção de drag
      dragState.started=true;
      e.preventDefault();
      startDrag(dragState.stopIdx,touch.clientX,touch.clientY,dragState.isTouch);
    }
    return;
  }
  onDragMove(e);
}
function onDragTrackEnd(e){
  if(!dragState)return;
  if(!dragState.started){
    // Não arrastou o suficiente → verificar se foi click rápido ou tentativa de drag abortada
    document.removeEventListener('mousemove',onDragTrack);
    document.removeEventListener('mouseup',onDragTrackEnd);
    document.removeEventListener('touchmove',onDragTrack);
    document.removeEventListener('touchend',onDragTrackEnd);
    // v4.7.3: Se segurou >250ms sem mover o suficiente, foi uma tentativa de drag — NÃO abrir editC
    const elapsed=Date.now()-dragState.startTime;
    if(!dragState.isTouch&&elapsed<250){
      const idx=order[dragState.stopIdx];
      if(idx!==undefined)editC(clients[idx].id);
    }
    dragState=null;
    return;
  }
  onDragEnd(e);
}
function startDrag(stopIdx,x,y,isTouch){
  const cards=[...document.querySelectorAll('.cc[data-stop]')];
  const card=cards[stopIdx];if(!card)return;
  const rect=card.getBoundingClientRect();
  const ghost=card.cloneNode(true);
  ghost.classList.add('drag-ghost');
  ghost.style.width=rect.width+'px';
  ghost.style.left=rect.left+'px';
  ghost.style.top=rect.top+'px';
  document.body.appendChild(ghost);
  card.classList.add('dragging');
  // Atualizar dragState mantendo referências
  dragState.ghost=ghost;
  dragState.offsetX=x-rect.left;
  dragState.offsetY=y-rect.top;
  // Substituir listeners de tracking por listeners de drag
  document.removeEventListener('mousemove',onDragTrack);
  document.removeEventListener('mouseup',onDragTrackEnd);
  document.removeEventListener('touchmove',onDragTrack);
  document.removeEventListener('touchend',onDragTrackEnd);
  if(isTouch){
    document.addEventListener('touchmove',onDragMove,{passive:false});
    document.addEventListener('touchend',onDragEnd);
  } else {
    document.addEventListener('mousemove',onDragMove);
    document.addEventListener('mouseup',onDragEnd);
  }
}
// v4.6.8: Auto-scroll durante drag
let _dragScrollRAF=null;
function _dragAutoScroll(clientY){
  const SCROLL_ZONE=80; // pixels da borda que ativam scroll
  const SCROLL_SPEED=10; // pixels por frame
  // v4.7.3: Detectar se está no modo mapa expandido — nesse caso, scrollar .map-sidebar em vez de window
  const mapWrap=document.querySelector('.map-fullscreen');
  const sidebar=mapWrap?mapWrap.querySelector('.map-sidebar'):null;
  if(sidebar){
    // Mapa expandido: scrollar o container da sidebar
    const sbRect=sidebar.getBoundingClientRect();
    if(clientY<sbRect.top+SCROLL_ZONE){
      sidebar.scrollBy(0,-SCROLL_SPEED);
    }else if(clientY>sbRect.bottom-SCROLL_ZONE){
      sidebar.scrollBy(0,SCROLL_SPEED);
    }else{return;}
  }else{
    // Modo normal: scrollar a janela
    if(clientY<SCROLL_ZONE+60){ // 60px = altura aprox da navbar fixa
      window.scrollBy(0,-SCROLL_SPEED);
    }else if(clientY>window.innerHeight-SCROLL_ZONE){
      window.scrollBy(0,SCROLL_SPEED);
    }else{return;}
  }
  _dragScrollRAF=requestAnimationFrame(()=>_dragAutoScroll(clientY));
}
function onDragMove(e){
  if(!dragState)return;
  e.preventDefault();
  const touch=e.touches?e.touches[0]:e;
  const y=touch.clientY,x=touch.clientX;
  dragState.ghost.style.top=(y-dragState.offsetY)+'px';
  dragState.ghost.style.left=(x-dragState.offsetX)+'px';
  // v4.6.8: Auto-scroll quando arrastar perto das bordas
  if(_dragScrollRAF)cancelAnimationFrame(_dragScrollRAF);
  _dragAutoScroll(y);
  // Determinar sobre qual card estamos
  const cards=[...document.querySelectorAll('.cc[data-stop]')];
  cards.forEach(c=>c.classList.remove('drag-over-top','drag-over-bottom'));
  // Gerenciar indicador de drop
  let indicator=document.getElementById('drop-indicator');
  if(!indicator){indicator=document.createElement('div');indicator.id='drop-indicator';indicator.className='drop-indicator';}
  indicator.classList.remove('visible');
  for(const c of cards){
    const r=c.getBoundingClientRect();
    const mid=r.top+r.height/2;
    if(y>r.top&&y<r.bottom){
      const si=parseInt(c.dataset.stop);
      if(si!==dragState.stopIdx){
        if(y<mid){c.classList.add('drag-over-top');c.parentNode.insertBefore(indicator,c);}
        else{c.classList.add('drag-over-bottom');c.parentNode.insertBefore(indicator,c.nextSibling);}
        indicator.classList.add('visible');
      }
      dragState.overStop=si;dragState.overHalf=y<mid?'top':'bottom';
      return;
    }
  }
  dragState.overStop=null;
}
function onDragEnd(e){
  if(!dragState)return;
  // v4.6.8: Parar auto-scroll
  if(_dragScrollRAF){cancelAnimationFrame(_dragScrollRAF);_dragScrollRAF=null;}
  document.removeEventListener('mousemove',onDragMove);
  document.removeEventListener('mouseup',onDragEnd);
  document.removeEventListener('touchmove',onDragMove);
  document.removeEventListener('touchend',onDragEnd);
  // Limpar classes visuais
  document.querySelectorAll('.cc').forEach(c=>c.classList.remove('dragging','drag-over-top','drag-over-bottom'));
  const dropInd=document.getElementById('drop-indicator');if(dropInd)dropInd.remove();
  if(dragState.ghost)dragState.ghost.remove();
  // Aplicar reordenação
  const from=dragState.stopIdx;
  let to=dragState.overStop;
  if(to!==null&&to!==undefined&&to!==from){
    if(dragState.overHalf==='bottom')to++;
    if(to>from)to--;
    if(to!==from&&to>=0&&to<order.length){
      pushRouteState(); // v4.6.2: save state before reorder for undo
      const item=order.splice(from,1)[0];
      order.splice(to,0,item);
      // v4.6.6: Recalcular ETAs instantaneamente via cache, depois refinar com Google
      if(recalcETAsFromCache()){renderC();toast(t('t.orderupd'),'ok');}
      else{renderC();}
      recalcRouteFromOrder();updateUndoBtn();
    }
  }
  dragState=null;
}
// Recalcular a rota no mapa após reordenação manual
// ====== v4.5.0: ROUTE INTELLIGENCE ENGINE ======

// --- Undo System ---
let _routeHistory=[];
const MAX_UNDO=10;
function pushRouteState(){
  _routeHistory.push({order:[...order],clients:JSON.parse(JSON.stringify(clients.map(c=>({estT:c.estT,conflict:c.conflict,cmsg:c.cmsg}))))});
  if(_routeHistory.length>MAX_UNDO)_routeHistory.shift();
  updateUndoBtn();
}
function undoRoute(){
  if(!_routeHistory.length)return;
  const prev=_routeHistory.pop();
  order=[...prev.order];
  prev.clients.forEach((saved,i)=>{if(clients[i]){clients[i].estT=saved.estT;clients[i].conflict=saved.conflict;clients[i].cmsg=saved.cmsg;}});
  animateRouteTransition();
  renderC();recalcRouteFromOrder();updateMapSidebar();updateUndoBtn(); // v4.6.2: removed pushRouteState after undo (was causing double entries)
  toast(t('t.undone'),'ok');
}
function updateUndoBtn(){
  const btn=document.querySelector('.undo-btn');
  if(btn)btn.classList.toggle('active',_routeHistory.length>0);
}
// Ctrl+Z keyboard shortcut for undo
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='z'&&_routeHistory.length>0&&mapIsFullscreen){
    e.preventDefault();undoRoute();
  }
});

// --- Route Mode (time vs distance) ---
let _routeMode='time'; // 'time' or 'distance'
let _routeResults={time:null,distance:null}; // cached results from optimizer
function getRouteMode(){return _routeMode||'time';} // v4.6.2: cfg.routePriority removido
function toggleRouteMode(){
  setRouteMode(_routeMode==='time'?'distance':'time');
  // Update visual toggle
  document.querySelectorAll('.route-mode-toggle').forEach(el=>{
    el.classList.toggle('distance',_routeMode==='distance');
  });
}
function setRouteMode(mode){
  _routeMode=mode;
  updateRouteModeToggle();
  // If we have cached results, switch instantly
  if(_routeResults[mode]){
    applyRouteResult(_routeResults[mode]);
    animateRouteTransition();
  }
}
function updateRouteModeToggle(){
  document.querySelectorAll('.rmt-opt').forEach(el=>{
    el.classList.toggle('active',el.dataset.mode===_routeMode);
  });
}

// --- Optimization Savings Indicator ---
function showOptSavings(bestResult,worstResult){
  const el=document.querySelector('.opt-savings');
  if(!el||!bestResult||!worstResult)return;
  const timeSaved=Math.round(worstResult.totalMin-bestResult.totalMin);
  const kmSaved=(worstResult.totalKm-bestResult.totalKm).toFixed(1);
  let msg='';
  if(_routeMode==='time'&&timeSaved>0)msg='Otimiza\xe7\xe3o economizou '+timeSaved+' min na rota';
  else if(_routeMode==='distance'&&parseFloat(kmSaved)>0)msg='Otimiza\xe7\xe3o economizou '+kmSaved+' km na rota';
  else if(timeSaved>0)msg='Otimiza\xe7\xe3o economizou '+timeSaved+' min';
  if(msg){el.querySelector('.opt-savings-text').textContent=msg;el.classList.add('show');}
  else el.classList.remove('show');
}


// ════════════════════════════════════════════════════════════
// SECTION: OPTIMIZATION ENGINE
// ════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// v4.6.6: MOTOR DE OTIMIZAÇÃO v2 — VRPTW com Simulated Annealing
// Fluxo: Matriz OSRM → Heurísticas construtivas → SA refinement
// ═══════════════════════════════════════════════════════════════
let _cachedMatrix=null; // Cache da matriz para recálculos rápidos

// v4.6.9: Rebuild da matriz OSRM em background (para ETAs no drag após restaurar rota)
async function _rebuildCachedMatrix(){
  if(_cachedMatrix)return; // já tem
  const geocodedIdx=order.filter(i=>clients[i]&&clients[i].lat&&clients[i].lng);
  if(geocodedIdx.length<2)return;
  try{
    // Geocodificar endereço base via Google Geocoding API
    const baseAddr=cfg.base;
    if(!baseAddr)return;
    // v4.8.4: Timeout 6s para geocoding em rebuild background
    const _rbC1=new AbortController();const _rbT1=setTimeout(()=>_rbC1.abort(),6000);
    const geoResp=await _geocodeProxy('address='+encodeURIComponent(baseAddr+', Brasil')+'&region=br',_rbC1.signal);
    clearTimeout(_rbT1);
    if(!geoResp||geoResp.status!=='OK'||!geoResp.results[0]?.geometry?.location)return;
    const baseLoc=geoResp.results[0].geometry.location;
    const baseCoords={lat:baseLoc.lat,lng:baseLoc.lng};
    let retCoords=baseCoords;
    if(cfg.retaddr&&cfg.retaddr!==baseAddr){
      const _rbC2=new AbortController();const _rbT2=setTimeout(()=>_rbC2.abort(),6000);
      const retResp=await _geocodeProxy('address='+encodeURIComponent(cfg.retaddr+', Brasil')+'&region=br',_rbC2.signal);
      clearTimeout(_rbT2);
      if(retResp.status==='OK'&&retResp.results[0]){const rl=retResp.results[0].geometry.location;retCoords={lat:rl.lat,lng:rl.lng};}
    }
    const allCoords=[baseCoords,...geocodedIdx.map(i=>({lat:clients[i].lat,lng:clients[i].lng})),retCoords];
    const gcIdx={};
    geocodedIdx.forEach((ci,i)=>{gcIdx[ci]=i+1;});
    const matrix=await buildTimeMatrix(allCoords);
    _cachedMatrix={matrix,gcIdx,allCoords};
    console.log('[CACHE] Matriz OSRM reconstruída para '+geocodedIdx.length+' clientes');
  }catch(e){console.warn('[CACHE] Falha ao reconstruir matriz:',e.message);}
}

// Etapa 1: Construir matriz de tempos reais (OSRM → Google → Haversine)
/* v4.7.6: Cache de time matrix em sessionStorage */
function _matrixCacheKey(allCoords){
  return 'tmx_'+allCoords.map(c=>c.lat.toFixed(5)+','+c.lng.toFixed(5)).join('|');
}
// v4.8.5: Polyfill Promise.any para browsers antigos (Safari <14, Chrome <85)
if(!Promise.any){Promise.any=function(promises){return new Promise((resolve,reject)=>{let errors=[];let remaining=promises.length;if(!remaining)return reject(new AggregateError([],'All promises were rejected'));promises.forEach((p,i)=>{Promise.resolve(p).then(resolve).catch(e=>{errors[i]=e;if(--remaining===0)reject(new AggregateError(errors,'All promises were rejected'));});});});};}
// v4.8.5: Flags de falha — skip OSRM/Worker se já falharam nesta sessão
let _osrmFailCount=0,_workerFailCount=0;
const _FAIL_THRESHOLD=2; // Após 2 falhas, skip automático na sessão

async function buildTimeMatrix(allCoords){
  const N=allCoords.length;
  const _mt0=performance.now();
  // v4.7.6: Verificar cache antes de tudo
  const cacheKey=_matrixCacheKey(allCoords);
  try{
    const cached=sessionStorage.getItem(cacheKey);
    if(cached){
      const data=JSON.parse(cached);
      if(data.durations&&data.distances){
        console.log('[MATRIX] Cache hit — '+N+'x'+N+' ('+Math.round(performance.now()-_mt0)+'ms)');
        return data;
      }
    }
  }catch(e){}
  // v4.8.5: HAVERSINE PRIMEIRO — calcular instantaneamente como fallback garantido
  const hvDurs=[],hvDists=[];
  for(let i=0;i<N;i++){
    hvDurs[i]=[];hvDists[i]=[];
    for(let j=0;j<N;j++){
      const km=_haversineKm(allCoords[i].lat,allCoords[i].lng,allCoords[j].lat,allCoords[j].lng);
      hvDists[i][j]=km*1000;
      hvDurs[i][j]=(km*1.4/25)*3600; // fator urbano SP: ×1.4, 25km/h média
    }
  }
  const haversineResult={durations:hvDurs,distances:hvDists,source:'haversine'};
  console.log('[MATRIX] Haversine pronto em '+Math.round(performance.now()-_mt0)+'ms — '+N+'x'+N);
  // v4.8.5: Tentar OSRM e Worker em CORRIDA PARALELA com 3s timeout
  // Se algum responder a tempo, usa (mais preciso). Se não, haversine já está pronto.
  const coordStr=allCoords.map(c=>c.lng+','+c.lat).join(';');
  const racers=[];
  if(_osrmFailCount<_FAIL_THRESHOLD){
    racers.push((async()=>{
      const ctrl=new AbortController();const tid=setTimeout(()=>ctrl.abort(),3000);
      try{
        const resp=await fetch('https://router.project-osrm.org/table/v1/driving/'+coordStr+'?annotations=duration,distance',{signal:ctrl.signal});
        clearTimeout(tid);
        if(!resp.ok)throw new Error('HTTP '+resp.status);
        const data=await resp.json();
        if(data.code==='Ok'&&data.durations&&data.distances){
          _osrmFailCount=0; // Reset no sucesso
          return {durations:data.durations,distances:data.distances,source:'osrm'};
        }
        throw new Error('OSRM code: '+(data.code||'unknown'));
      }catch(e){clearTimeout(tid);_osrmFailCount++;console.warn('[MATRIX] OSRM falhou ('+_osrmFailCount+'/'+_FAIL_THRESHOLD+'):',e.message);throw e;}
    })());
  } else {console.log('[MATRIX] OSRM skip — '+_osrmFailCount+' falhas consecutivas');}
  if(_workerFailCount<_FAIL_THRESHOLD){
    racers.push((async()=>{
      const ctrl=new AbortController();const tid=setTimeout(()=>ctrl.abort(),3000);
      try{
        const resp=await fetch('https://roteiro-lavanderia.nigel-guandalini.workers.dev/osrm-proxy?coords='+encodeURIComponent(coordStr),{signal:ctrl.signal});
        clearTimeout(tid);
        if(!resp.ok)throw new Error('HTTP '+resp.status);
        const data=await resp.json();
        if(data.durations&&data.distances){
          _workerFailCount=0;
          return {durations:data.durations,distances:data.distances,source:'worker-proxy'};
        }
        throw new Error('Worker: no data');
      }catch(e){clearTimeout(tid);_workerFailCount++;console.warn('[MATRIX] Worker falhou ('+_workerFailCount+'/'+_FAIL_THRESHOLD+'):',e.message);throw e;}
    })());
  } else {console.log('[MATRIX] Worker skip — '+_workerFailCount+' falhas consecutivas');}
  // Se tem racers, tentar Promise.any (primeiro que resolver ganha)
  if(racers.length>0){
    try{
      const result=await Promise.any(racers);
      console.log('[MATRIX] '+result.source+' OK — '+N+'x'+N+' ('+Math.round(performance.now()-_mt0)+'ms)');
      try{sessionStorage.setItem(cacheKey,JSON.stringify(result));}catch(e){}
      return result;
    }catch(e){
      // Todos falharam — usar haversine (já calculado)
      console.log('[MATRIX] OSRM+Worker falharam — usando haversine ('+Math.round(performance.now()-_mt0)+'ms total desperdiçado em rede)');
    }
  }
  // Fallback: haversine já pronto
  console.log('[MATRIX] Final: haversine × 1.4 — '+N+'x'+N+' ('+Math.round(performance.now()-_mt0)+'ms)');
  return haversineResult;
}
function _haversineKm(lat1,lon1,lat2,lon2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// Etapa 2: Funções de avaliação
function _clientDeadlineSec(c){
  // v5.8.28: sem margem hardcoded — o ETA_BUFFER dinâmico em _evalOrder já aplica a margem por leg
  if(c.janela==='manha')return 12*3600;
  if(c.janela==='custom'&&c.hf)return ts(c.hf);
  if(c.janela==='tarde')return 24*3600;
  return 24*3600;
}
function _clientStartSec(c){
  if(c.janela==='tarde')return 12*3600;
  if(c.janela==='custom'&&c.hi)return ts(c.hi);
  return 0;
}
// v4.7.4: Cache de parâmetros fixos para _evalOrder (evita ~350k string splits no SA)
let _evalCache=null;
function _buildEvalCache(){
  const saidaSec=ts(cfg.saida||'10:00');
  const tempoSec=(cfg.tempo||10)*60;
  const etaBufferSec=_getEtaBufferSec(); // v5.8.28: buffer dinâmico por leg
  const al1Sec=cfg.al1?ts(cfg.al1):0;
  const al2Sec=cfg.al2?ts(cfg.al2):0;
  const hasAlmoco=!!(cfg.al1&&cfg.al2);
  // Pré-calcular deadlines e starts de todos os clientes
  const deadlines=new Float64Array(clients.length);
  const starts=new Float64Array(clients.length);
  for(let i=0;i<clients.length;i++){
    deadlines[i]=_clientDeadlineSec(clients[i]);
    starts[i]=_clientStartSec(clients[i]);
  }
  _evalCache={saidaSec,tempoSec,etaBufferSec,al1Sec,al2Sec,hasAlmoco,deadlines,starts};
}
function _evalOrder(order,matrix,alpha,gcIdx){
  const ec=_evalCache;
  let cur=ec.saidaSec,totalTravel=0,violations=0,violTime=0;
  const arrivals=[];
  const durs=matrix.durations;
  for(let i=0;i<order.length;i++){
    const fromNode=i===0?0:gcIdx[order[i-1]];
    const toNode=gcIdx[order[i]];
    const travel=durs[fromNode][toNode];
    cur+=travel+ec.etaBufferSec; // v5.8.28: buffer por leg — otimizador opera com mesmos ETAs do display
    totalTravel+=travel;
    // Pausa almoço
    if(ec.hasAlmoco&&cur>=ec.al1Sec&&cur<ec.al2Sec)cur=ec.al2Sec;
    arrivals.push({idx:order[i],arrival:cur});
    // Verificar janela
    const ci=order[i];
    const dl=ec.deadlines[ci];
    const st=ec.starts[ci];
    if(cur>dl){violations++;violTime+=Math.max(cur-dl,3600);}
    if(cur<st){violTime+=Math.max(st-cur,1800);}
    cur+=ec.tempoSec;
  }
  // Retorno
  const lastNode=gcIdx[order[order.length-1]];
  const retNode=durs.length-1;
  const travelRet=durs[lastNode][retNode];
  cur+=travelRet;totalTravel+=travelRet;
  const cost=totalTravel+alpha*violTime;
  return {cost,totalTravel,violations,violTime,lastArrival:cur,arrivals};
}

// Etapa 3: Heurística — Nearest Neighbor com prioridade de deadline
function _nnDeadline(matrix,gcIdx){
  const N=clients.length;
  const visited=new Set();const order=[];
  const saidaSec=ts(cfg.saida||'10:00');
  // v5.8.28: Todos os clientes com deadline real (<24h) são críticos — ordenados por prazo
  // Fix: antes só deadline≤12h era crítico; clientes custom (ex: 07:00-14:00) iam para urgentes (geo)
  const criticos=[],urgentes=[];
  for(let i=0;i<N;i++){
    if(clients[i].janela==='livre')continue;
    if(gcIdx[i]===undefined)continue; // v5.8.31: pula não-geocodificados (sem entrada na matriz)
    const dl=_clientDeadlineSec(clients[i]);
    if(dl<24*3600)criticos.push({idx:i,dl}); // inclui manhã E custom (qualquer deadline real)
    else urgentes.push(i); // tarde (dl=24h) → nearest neighbor
  }
  // Críticos: ordenar por deadline (mais apertado primeiro), depois nearest entre empates
  criticos.sort((a,b)=>a.dl-b.dl);
  let curNode=0; // base
  for(const c of criticos){
    order.push(c.idx);visited.add(c.idx);curNode=gcIdx[c.idx];
  }
  // Depois os urgentes restantes (nearest neighbor)
  const urgSet=new Set(urgentes);
  while(urgSet.size>0){
    let best=Infinity,bestId=-1;
    for(const u of urgSet){
      const d=matrix.durations[curNode][gcIdx[u]];
      if(d<best){best=d;bestId=u;}
    }
    order.push(bestId);visited.add(bestId);urgSet.delete(bestId);
    curNode=gcIdx[bestId];
  }
  while(visited.size<N){
    let best=Infinity,bestId=-1;
    for(let i=0;i<N;i++){
      if(visited.has(i))continue;
      const d=matrix.durations[curNode][gcIdx[i]];
      if(d<best){best=d;bestId=i;}
    }
    if(bestId>=0){order.push(bestId);visited.add(bestId);curNode=gcIdx[bestId];}
    else break;
  }
  return order;
}

// Etapa 3b: Heurística — Cheapest Insertion com time windows
function _cheapestInsertTW(matrix,gcIdx){
  const N=clients.length;const alpha=3000; // v4.6.7: consistente com α do SA
  // v5.8.31: Começar com o mais urgente GEOCODIFICADO (evita crash com não-geocodificados)
  let urgIdx=-1,minDl=Infinity;
  for(let i=0;i<N;i++){if(gcIdx[i]===undefined)continue;const dl=_clientDeadlineSec(clients[i]);if(dl<minDl){minDl=dl;urgIdx=i;}}
  if(urgIdx<0)return [];
  const order=[urgIdx];const inserted=new Set([urgIdx]);
  while(inserted.size<N){
    let bestCost=Infinity,bestC=-1,bestPos=-1;
    for(let c=0;c<N;c++){
      if(inserted.has(c))continue;
      if(gcIdx[c]===undefined)continue; // v5.8.31: pula não-geocodificados
      for(let pos=0;pos<=order.length;pos++){
        const test=[...order];test.splice(pos,0,c);
        const r=_evalOrder(test,matrix,alpha,gcIdx);
        if(r.cost<bestCost){bestCost=r.cost;bestC=c;bestPos=pos;}
      }
    }
    if(bestC>=0){order.splice(bestPos,0,bestC);inserted.add(bestC);}
    else break;
  }
  return order;
}

// Etapa 4: Simulated Annealing
// v4.7.4: Perturbações otimizadas — cópia única do array + operações in-place
function _sa2opt(order){
  const n=order.length;
  let i=Math.floor(Math.random()*n),j=Math.floor(Math.random()*n);
  while(j===i)j=Math.floor(Math.random()*n);
  const lo=i<j?i:j,hi=i<j?j:i;
  const r=order.slice();
  for(let a=lo,b=hi;a<b;a++,b--){const tmp=r[a];r[a]=r[b];r[b]=tmp;}
  return r;
}
function _saOrOpt(order){
  const n=order.length;if(n<3)return _saSwap(order);
  const segLen=Math.min(1+Math.floor(Math.random()*3),n-1);
  const from=Math.floor(Math.random()*(n-segLen));
  let to=Math.floor(Math.random()*(n-segLen));
  while(to===from)to=Math.floor(Math.random()*(n-segLen));
  const r=order.slice();const seg=r.splice(from,segLen);
  const ins=to>from?to-segLen+1:to;
  r.splice(Math.max(0,Math.min(ins,r.length)),0,...seg);
  return r;
}
function _saSwap(order){
  const n=order.length;
  let i=Math.floor(Math.random()*n),j=Math.floor(Math.random()*n);
  while(j===i)j=Math.floor(Math.random()*n);
  const r=order.slice();const tmp=r[i];r[i]=r[j];r[j]=tmp;return r;
}
function _saPerturb(order){
  const r=Math.random();
  if(r<0.33)return _sa2opt(order);
  if(r<0.66)return _saOrOpt(order);
  return _saSwap(order);
}

function _runSA(initialOrder,matrix,gcIdx){
  const N=initialOrder.length;
  let alpha=3000; // v4.6.7: α inicial mais alto — violações pesam 3× desde o início
  let current=[...initialOrder];
  let currentEval=_evalOrder(current,matrix,alpha,gcIdx);
  let best=[...current],bestEval={...currentEval};
  // Calibrar T0 (aceitar ~80% piores)
  const deltas=[];
  for(let i=0;i<200;i++){
    const nb=_saPerturb(current);
    const nbE=_evalOrder(nb,matrix,alpha,gcIdx);
    const d=nbE.cost-currentEval.cost;
    if(d>0)deltas.push(d);
  }
  const avgD=deltas.length>0?deltas.reduce((a,b)=>a+b,0)/deltas.length:1000;
  let T=-avgD/Math.log(0.8);
  // v4.7.4: Parâmetros adaptativos — rotas pequenas convergem mais rápido
  const cool=N<=20?0.995:0.997;
  const iterPerT=Math.min(5*N,80);
  let noImprove=0,maxNoImprove=N<=20?400:800,iter=0;
  while(T>0.01&&noImprove<maxNoImprove){
    for(let i=0;i<iterPerT;i++){
      const nb=_saPerturb(current);
      const nbE=_evalOrder(nb,matrix,alpha,gcIdx);
      const delta=nbE.cost-currentEval.cost;
      if(delta<0||Math.random()<Math.exp(-delta/T)){
        current=nb;currentEval=nbE;
        if(currentEval.cost<bestEval.cost){
          best=[...current];bestEval={...currentEval};noImprove=0;
        }
      }
    }
    // Penalidade adaptativa
    const check=_evalOrder(best,matrix,0,gcIdx);
    if(check.violations>0)alpha*=1.2;
    else alpha=Math.max(alpha*0.9,1500); // v4.6.7: piso do α mais alto
    currentEval=_evalOrder(current,matrix,alpha,gcIdx);
    bestEval=_evalOrder(best,matrix,alpha,gcIdx);
    T*=cool;noImprove++;iter++;
  }
  console.log('[SA] '+iter+' ciclos, T='+T.toFixed(2)+', alpha='+alpha.toFixed(0)+', violations='+_evalOrder(best,matrix,0,gcIdx).violations);
  return best;
}

// Etapa 5: Função principal do motor v2
async function optimizeRouteV2(geocodedIdx,baseCoords,retCoords){
  // v4.7.3: Timing detalhado para diagnóstico de performance
  const _t0=performance.now();
  // Construir array de coordenadas: [base, ...clientes geocodificados, retorno]
  const geocoded=geocodedIdx.map(i=>clients[i]);
  const allCoords=[baseCoords,...geocoded.map(c=>({lat:c.lat,lng:c.lng})),retCoords];
  // gcIdx mapeia índice no array clients → índice na matriz
  const gcIdx={};
  geocodedIdx.forEach((ci,i)=>{gcIdx[ci]=i+1;}); // +1 porque 0=base
  // Construir matriz
  const _t1=performance.now();
  const matrix=await buildTimeMatrix(allCoords);
  const _t2=performance.now();
  console.log('[OPT-v2] ⏱ buildTimeMatrix: '+Math.round(_t2-_t1)+'ms ('+allCoords.length+' pontos)');
  _cachedMatrix={matrix,gcIdx,allCoords}; // Cache para recálculos
  // v4.7.4: Construir cache de parâmetros fixos (evita ts() repetido no SA)
  _buildEvalCache();
  // Rodar duas heurísticas construtivas
  const nnOrder=_nnDeadline(matrix,gcIdx);
  const ciOrder=_cheapestInsertTW(matrix,gcIdx);
  const _t3=performance.now();
  console.log('[OPT-v2] ⏱ Heurísticas (NN+CI): '+Math.round(_t3-_t2)+'ms');
  const nnEval=_evalOrder(nnOrder,matrix,0,gcIdx);
  const ciEval=_evalOrder(ciOrder,matrix,0,gcIdx);
  console.log('[OPT-v2] NN: '+Math.round(nnEval.totalTravel/60)+'min, '+nnEval.violations+' violações');
  console.log('[OPT-v2] CI: '+Math.round(ciEval.totalTravel/60)+'min, '+ciEval.violations+' violações');
  // v4.6.7: Rodar SA nos DOIS seeds e pegar o melhor resultado global
  // (evita que um seed com menos km mas posição arriscada para clientes críticos domine)
  const _t4=performance.now();
  const saFromNN=_runSA(nnOrder,matrix,gcIdx);
  const _t5=performance.now();
  const saFromCI=_runSA(ciOrder,matrix,gcIdx);
  const _t6=performance.now();
  console.log('[OPT-v2] ⏱ SA-NN: '+Math.round(_t5-_t4)+'ms | SA-CI: '+Math.round(_t6-_t5)+'ms');
  const saEvalNN=_evalOrder(saFromNN,matrix,0,gcIdx);
  const saEvalCI=_evalOrder(saFromCI,matrix,0,gcIdx);
  console.log('[OPT-v2] SA-NN: '+Math.round(saEvalNN.totalTravel/60)+'min, '+saEvalNN.violations+' violações');
  console.log('[OPT-v2] SA-CI: '+Math.round(saEvalCI.totalTravel/60)+'min, '+saEvalCI.violations+' violações');
  // Escolher: menos violações primeiro, depois menor travel
  const saOrder=saEvalNN.violations<saEvalCI.violations?saFromNN:
    saEvalCI.violations<saEvalNN.violations?saFromCI:
    saEvalNN.totalTravel<=saEvalCI.totalTravel?saFromNN:saFromCI;
  const saEval=_evalOrder(saOrder,matrix,0,gcIdx);
  console.log('[OPT-v2] SA: '+Math.round(saEval.totalTravel/60)+'min, '+saEval.violations+' violações');
  // Mapear de volta para índices globais (array clients[])
  const finalOrder=saOrder; // já são índices globais de clients[]
  console.log('[OPT-v2] ⏱ TOTAL: '+Math.round(performance.now()-_t0)+'ms ('+geocodedIdx.length+' clientes)');
  return {order:finalOrder,eval:saEval,matrix,gcIdx};
}

// Recálculo rápido de ETAs usando matriz cacheada (para drag-and-drop)
function recalcETAsFromCache(){
  if(!_cachedMatrix)return false;
  const{matrix,gcIdx}=_cachedMatrix;
  const saidaSec=ts(cfg.saida||'10:00');
  const retSec=ts(cfg.ret||'17:00');
  const tempoSec=(cfg.tempo||10)*60;
  const al1=cfg.al1,al2=cfg.al2;
  let cur=saidaSec;
  // v4.6.8: Recalcular ETAs para TODOS os clientes na ordem atual
  // Rastrear último nó válido para não perder referência quando um client é skipado
  let lastValidNode=0; // 0 = base
  for(let i=0;i<order.length;i++){
    const idx=order[i];
    const c=clients[idx];
    if(!c.lat||!c.lng||!gcIdx.hasOwnProperty(idx)){
      // Cliente sem coordenadas — limpar ETA
      c.estT=null;c.conflict=false;c.cmsg='';
      continue;
    }
    const toNode=gcIdx[idx];
    const travel=matrix.durations[lastValidNode][toNode];
    if(typeof travel!=='number'||isNaN(travel)){
      c.estT=null;c.conflict=false;c.cmsg='';
      continue;
    }
    cur+=travel;
    cur+=_getEtaBufferSec(); // v5.8.28: buffer configurável por leg
    if(al1&&al2){const s1=ts(al1),s2=ts(al2);if(cur>=s1&&cur<s2)cur=s2;}
    c.estT=st2(cur);c.conflict=false;c.cmsg='';
    if(c.janela==='manha'&&cur>ts('12:00')){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', dispon\xEDvel at\xE9 12:00';}
    else if(c.janela==='tarde'&&cur<ts('12:00')){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', dispon\xEDvel ap\xF3s 12:00';}
    else if(c.janela==='custom'&&c.hi&&c.hf){
      if(cur<ts(c.hi)){
        // v5.8.41: chegada antes da janela — aguardar abertura e ajustar ETAs subsequentes
        const waitMin=Math.round((ts(c.hi)-cur)/60);
        c.conflict=true;c.cmsg='Chegada ~'+c.estT+', aguardar ~'+waitMin+'min (janela '+c.hi+')';
        cur=ts(c.hi); // snapa para abertura da janela
      } else if(cur>ts(c.hf)){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', janela encerrada \xE0s '+c.hf;}
    }
    if(cur>retSec){c.conflict=true;c.cmsg=(c.cmsg?c.cmsg+' / ':'')+'Al\xE9m do limite de retorno';}
    cur+=tempoSec;
    lastValidNode=toNode;
  }
  return true;
}
// ═══════════════════════════════════════════════════════════════

// --- Apply route result to UI ---
function applyRouteResult(result){
  if(!result)return;
  order=result.order.slice();
  _routeTotalKm=result.totalKm;
  _routeTotalMin=result.totalMin;
  // Re-estimate times
  if(result.legs){
    const legsDur=result.legs.map(l=>({duration:(l.duration_in_traffic||l.duration).value})); // v5.8.22
    estimateTimesOSRM(legsDur);
  }
  renderC();updStats();updateMapSidebar();
}

// --- Route transition animation ---
function animateRouteTransition(){
  const sb=document.querySelector('#ms-client-list');
  if(sb){
    sb.classList.add('route-animating');
    setTimeout(()=>sb.classList.remove('route-animating'),500);
  }
  const cl=g('clist');
  if(cl){
    cl.style.transition='opacity .3s';cl.style.opacity='0.3';
    setTimeout(()=>{cl.style.opacity='1';},50);
    setTimeout(()=>{cl.style.transition='';},400);
  }
}

/* v4.7.6: multiStrategyOptimize removido — código morto, substituído por optimizeRouteV2 (VRPTW+SA) */


let _recalcGen=0; // v4.6.9: generation counter para evitar resultados stale
async function recalcRouteFromOrder(){
  if(!gMap||!order.length)return;
  const gen=++_recalcGen; // captura geração atual
  const geocoded=order.filter(i=>clients[i].lat&&clients[i].lng).map(i=>clients[i]);
  if(geocoded.length<2)return;
  const baseAddr=cfg.base;
  const retAddr=cfg.retaddr||baseAddr;
  try{
    const waypoints=geocoded.map(c=>_waypointFor(c));
    // v5.8.23: tenta com tráfego; se INVALID_REQUEST, retry sem drivingOptions
    const _rReq={origin:baseAddr,destination:retAddr,waypoints,travelMode:google.maps.TravelMode.DRIVING,optimizeWaypoints:false,region:'BR'};
    let dirResult;
    try{dirResult=await new Promise((rOk,rErr)=>new google.maps.DirectionsService().route({..._rReq,drivingOptions:{departureTime:new Date()}},(res,status)=>status==='OK'?rOk(res):rErr(new Error(status))));}
    catch(e2){console.warn('[ROTA MANUAL] retry sem tráfego:',e2.message);dirResult=await new Promise((rOk,rErr)=>new google.maps.DirectionsService().route(_rReq,(res,status)=>status==='OK'?rOk(res):rErr(new Error(status))));}
    // v4.6.9: Se outra chamada já disparou, descartar este resultado stale
    if(gen!==_recalcGen){console.log('[ROTA] Descartando resultado stale (gen '+gen+' vs '+_recalcGen+')');return;}
    if(gRoute)gRoute.setMap(null);gMarkers.forEach(m=>{if(m.map)m.map=null;});gMarkers=[];gBaseMarkers.forEach(m=>{if(m.map)m.map=null;});gBaseMarkers=[];
    gRoute=new google.maps.DirectionsRenderer({map:gMap,directions:dirResult,suppressMarkers:true,polylineOptions:{strokeColor:'#6C5CE7',strokeWeight:4,strokeOpacity:0.8}});
    const legs=dirResult.routes[0].legs;
    // v5.8.29: mapa cliente→parada real (índice em order[]) para alinhar numeração com os cartões
    const _geoStopMap=new Map();
    order.forEach((ci,stopIdx)=>{if(clients[ci]&&clients[ci].lat&&clients[ci].lng)_geoStopMap.set(clients[ci],stopIdx);});
    // Markers na nova ordem (AdvancedMarkerElement)
    geocoded.forEach((c,pos)=>{
      if(legs[pos]&&legs[pos].end_location){c.lat=legs[pos].end_location.lat();c.lng=legs[pos].end_location.lng();}
      const tipos=normalizeTipo(c.tipo);const fillColor=tipos.length?_getTagColor(tipos[0]):'#787878';
      const stop=_geoStopMap.has(c)?_geoStopMap.get(c):pos;
      const mk=createAdvMarker({position:{lat:c.lat,lng:c.lng},map:gMap,label:String(stop+1),fillColor,onClick:()=>{openMarkerInfoWindow(mk,c,stop);}});
      gMarkers.push(mk);
    });
    // v4.3.5: Marcadores de partida e retorno
    const origin=legs[0].start_location;
    const destination=legs[legs.length-1].end_location;
    if(origin&&destination){
      if(origin.lat()===destination.lat()&&origin.lng()===destination.lng()){
        const mkBase=createBaseMarker({position:{lat:origin.lat(),lng:origin.lng()},map:gMap,title:t('map.departure_return'),type:'ambos'});
        gBaseMarkers.push(mkBase);
      } else {
        const mkStart=createBaseMarker({position:{lat:origin.lat(),lng:origin.lng()},map:gMap,title:t('map.departure'),type:'partida'});
        const mkEnd=createBaseMarker({position:{lat:destination.lat(),lng:destination.lng()},map:gMap,title:t('map.return'),type:'retorno'});
        gBaseMarkers.push(mkStart,mkEnd);
      }
    }
    // v4.3.4: Fechar InfoWindow ao clicar fora
    if(!_mapClickListenerSet){gMap.addListener('click',()=>{if(_activeInfoWindow){_activeInfoWindow.close();_activeInfoWindow=null;}});_mapClickListenerSet=true;}
    const bnds=new google.maps.LatLngBounds();geocoded.forEach(c=>bnds.extend({lat:c.lat,lng:c.lng}));gMap.fitBounds(bnds,{top:40,bottom:40,left:40,right:40});google.maps.event.addListenerOnce(gMap,'idle',()=>{if(gMap.getZoom()>16)gMap.setZoom(16);if(gMap.getZoom()<10)gMap.setZoom(10);});if(geocoded.length===1)gMap.setZoom(15);
    const legsDur=legs.map(l=>({duration:(l.duration_in_traffic||l.duration).value})); // v5.8.22
    estimateTimesOSRM(legsDur);
    _routeTotalKm=legs.reduce((s,l)=>s+l.distance.value,0)/1000;
    _routeTotalMin=legs.reduce((s,l)=>s+(l.duration_in_traffic||l.duration).value,0)/60; // v5.8.22
    console.log('[ROTA MANUAL] Rota recalculada: '+_routeTotalKm.toFixed(1)+'km | '+_routeTotalMin.toFixed(0)+'min');
    renderC();updStats();updateMapSidebar(); // v5.8.27: atualizar sidebar após recalcular rota
  }catch(e){console.error('[ROTA MANUAL] Erro ao recalcular:',e);}
}

function updStats(){
  const col=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('coleta'));}),ent=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('entrega'));});
  g('s-cli').textContent=clients.length;
  // Contagem dinâmica por tag — respeita rótulos configurados pelo usuário
  const tagCounts={};clients.forEach(c=>{normalizeTipo(c.tipo).forEach(id=>{tagCounts[id]=(tagCounts[id]||0)+1;});});
  function _pluralPT(word,n){if(n===1)return word;if(word.endsWith('ção'))return word.slice(0,-3)+'ções';if(word.endsWith('ão'))return word.slice(0,-2)+'ões';return word+'s';}
  const subParts=_tags.filter(tag=>tagCounts[tag.id]>0).slice(0,3).map(tag=>tagCounts[tag.id]+' '+_pluralPT(tag.label||tag.id,tagCounts[tag.id]));
  g('s-sub').textContent=subParts.length?subParts.join(' · '):'';
  g('s-ret').textContent=col.reduce((s,c)=>s+(c.qtd||0),0);
  g('s-ent').textContent=ent.reduce((s,c)=>s+(c.qtd||0),0);
}
function updBtns(){const has=clients.length>0;g('route-btn').disabled=!has;g('pdf-btn').disabled=!has;g('publish-btn').disabled=!has;g('insert-btn').disabled=!has;}

// ---- MAPA FULLSCREEN ----
let mapOriginalParent=null,mapOriginalNext=null,mapIsFullscreen=false;
function fmtEnderecoComCidade(c){
  let addr=c.endereco+(c.complemento?' — '+c.complemento:'');
  // v4.3.2: Mostra município com traço (sem parênteses) e sem redundância
  if(c._cidade){
    const baseCidade=_geoAnchor?.city||'';
    // Só adiciona se: (1) diferente da cidade-base E (2) cidade não já aparece no endereço
    if(baseCidade&&c._cidade!==baseCidade&&!addr.toLowerCase().includes(c._cidade.toLowerCase())){
      addr+=' — '+c._cidade;
    }
  }
  return addr;
}
let _activeInfoWindow=null;
let _routeTotalKm=0,_routeTotalMin=0;
let _mapClickListenerSet=false;
function toggleMapFullscreen(){
  const wrap=g('mapw'),expIcon=g('expand-icon'),colIcon=g('collapse-icon'),btn=g('map-expand-btn');
  mapIsFullscreen=!mapIsFullscreen;
  if(mapIsFullscreen){
    mapOriginalParent=wrap.parentNode;
    mapOriginalNext=wrap.nextSibling;
    document.body.appendChild(wrap);
    wrap.classList.add('map-fullscreen');
    document.body.classList.add('map-fs');
    updateMapSidebar();
  } else {
    wrap.classList.remove('map-fullscreen');
    document.body.classList.remove('map-fs');
    if(mapOriginalNext)mapOriginalParent.insertBefore(wrap,mapOriginalNext);
    else mapOriginalParent.appendChild(wrap);
    g('map-sidebar').innerHTML='';
  }
  expIcon.style.display=mapIsFullscreen?'none':'block';
  colIcon.style.display=mapIsFullscreen?'block':'none';
  btn.title=mapIsFullscreen?t('map.reduce'):t('map.expand');
  document.body.style.overflow=mapIsFullscreen?'hidden':'';
  if(gMap){setTimeout(()=>{google.maps.event.trigger(gMap,'resize');if(gMarkers.length){const bnds=new google.maps.LatLngBounds();gMarkers.forEach(m=>{const p=m.position;if(p)bnds.extend(p);});gMap.fitBounds(bnds,{top:40,bottom:40,left:40,right:40});}},150);}
}
function updateMapSidebar(){
  const sb=g('map-sidebar');if(!sb||!clients.length)return;
  const doneCount=order.filter(i=>clients[i]._motDone).length;
  const totalStops=order.length;
  const lastClient=order.length?clients[order[order.length-1]]:null;
  const etaFim=lastClient?.estT||'--:--';
  let html='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
    +'<div style="font-size:15px;font-weight:800;color:var(--tx)">'+t('map.panel_title')+'</div>'
    +'<button class="undo-btn'+((_routeHistory.length>0)?' active':'')+'" onclick="undoRoute()" title="'+t('map.undo_tip')+'">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>'
    +t('btn.undo')+'</button></div>';
  // v4.6.1: Toggle KM/Tempo removido (funcionalidade descontinuada)
  // v4.5.0: Savings indicator
  html+='<div class="opt-savings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span class="opt-savings-text"></span></div>';
  html+='<div class="ms-route-stats">'
    +'<div class="ms-stat"><div class="ms-stat-val">'+_routeTotalKm.toFixed(1)+' km</div><div class="ms-stat-label">'+t('map.dist')+'</div></div>'
    +'<div class="ms-stat"><div class="ms-stat-val">'+fmtDuration(Math.round(_routeTotalMin))+'</div><div class="ms-stat-label">'+t('map.time')+'</div></div>'
    +'<div class="ms-stat"><div class="ms-stat-val">'+doneCount+'/'+totalStops+'</div><div class="ms-stat-label">'+t('map.done')+'</div></div>'
    +'<div class="ms-stat"><div class="ms-stat-val">'+etaFim+'</div><div class="ms-stat-label">'+t('map.last')+'</div></div>'
  +'</div>';
  // v4.3.4: Progress bar and delay warning
  const progressPercent=totalStops>0?Math.round(doneCount/totalStops*100):0;
  html+='<div style="background:var(--bd);border-radius:6px;height:6px;margin-bottom:12px;overflow:hidden">'
    +'<div style="background:var(--pu);height:100%;border-radius:6px;width:'+progressPercent+'%;transition:width .3s"></div>'
  +'</div>'
    +'<div style="font-size:11px;color:var(--mu);margin-bottom:12px;font-weight:500">'+doneCount+'/'+totalStops+' '+t('map.stops')+' ('+progressPercent+'%)</div>';
  // Check for delays
  const delayedCount=order.filter(i=>clients[i].conflict&&clients[i].cmsg.includes(t('map.beyond_limit'))).length;
  if(delayedCount>0){
    const isDarkMode=document.body.classList.contains('dark');
    html+='<div style="background:'+(isDarkMode?'rgba(245,158,11,.12)':'#FEF3C7')+';border:1px solid '+(isDarkMode?'rgba(245,158,11,.3)':'#F59E0B')+';border-radius:10px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;gap:8px;font-size:12px;color:'+(isDarkMode?'#FBBF24':'#92400E')+';font-weight:500">'
      +_icoAlert+' '+t('map.delayed',{n:delayedCount})
    +'</div>';
  }
  html+='<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mu);margin-bottom:8px">'+t('map.stops')+'</div>';
  // v4.3.5: Cart\xf5es com multi-tags + drag and drop
  html+='<div id="ms-client-list">';
  // v4.9.3: Sidebar card = reflexo EXATO do card da tela inicial (decisão Philip)
  order.forEach((idx,stop)=>{
    const c=clients[idx];
    const isDone=!!c._motDone;
    const tipos=normalizeTipo(c.tipo);
    const primaryColor=tipos.length?_getTagColor(tipos[0]):'rgba(108,92,231,.18)';
    const bw=tagBorderWidth(tipos);
    const vd=c.valTipo==='medir'?t('form.medir'):c.valTipo==='pago'?t('form.pago'):c.val?'R$ '+fmtBRL(c.val):'';
    const jl={livre:'',manha:t('card.until_noon'),tarde:t('card.after_noon'),custom:c.hi+'\u2013'+c.hf}[c.janela]||'';
    const tagChips=renderTagChips(tipos);
    const borderStyle=tipos.length<=1?'border-left:3px solid '+primaryColor:'border-left:none';
    html+='<div class="ms-client'+(isDone?' done':'')+'" data-msstop="'+stop+'" data-clientid="'+c.id+'" style="'+borderStyle+';display:flex;align-items:center;gap:8px;cursor:grab;position:relative;'+(tipos.length>1?'padding-left:'+(12+bw)+'px;overflow:hidden':'')+'">'
      +(tipos.length>1?renderTagBorder(tipos):'')
      +'<span class="ms-client-num" style="background:'+primaryColor+'">'+(stop+1)+'</span>'
      +'<div style="flex:1;min-width:0">'
        +'<div style="display:flex;align-items:center;justify-content:space-between;gap:4px">'
          +'<div style="font-weight:600;font-size:13px;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+_stripEmoji(c.nome)+'</div>'
          +(tagChips?'<div style="display:flex;gap:2px;flex-wrap:wrap;flex-shrink:0">'+tagChips+'</div>':'')
        +'</div>'
        +(c.endereco?'<div style="font-size:11px;color:var(--mu);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+fmtEnderecoComCidade(c)+'</div>':'')
        +'<div style="display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap">'
          +(c.tel?'<span style="font-size:10px;color:var(--mu)">'+_icoPhone+' '+c.tel+'</span>':'')
          +(c.qtd?'<span style="font-size:10px;color:var(--mu)">'+c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':'')+'</span>':'')
          +(vd?'<span style="font-size:10px;color:var(--mu)">'+vd+'</span>':'')
          +(jl?'<span style="font-size:10px;color:var(--mu)">'+jl+'</span>':'')
          +(c.estT?'<span style="font-size:10px;color:var(--pu);font-weight:600">'+t('card.arrival')+' '+c.estT+'</span>':'')
        +'</div>'
        +(c.obs?'<div style="font-size:11px;color:var(--mu);margin-top:3px;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+_stripEmoji(c.obs)+'</div>':'')
        +(c.conflict?'<div style="font-size:11px;color:var(--rd);margin-top:2px;font-weight:500">'+_icoAlert+' '+c.cmsg+'</div>':'')
      +'</div>'
      +'<button class="ms-client-del" onclick="event.stopPropagation();removeCFromSidebar('+c.id+')" title="Remover da rota">\u2715</button>'
    +'</div>';
  });
  html+='</div>';
  sb.innerHTML=html;
  // v4.3.7: Restaurar largura salva da sidebar
  const savedW=localStorage.getItem('sidebar_width');
  if(savedW)sb.style.width=savedW+'px';
  // v4.3.7: Adicionar handle de resize se não existir
  if(!sb.querySelector('.map-sidebar-resize')){
    const handle=document.createElement('div');
    handle.className='map-sidebar-resize';
    sb.appendChild(handle);
    let resizing=false,startX=0,startW=0;
    handle.addEventListener('mousedown',e=>{
      e.preventDefault();resizing=true;startX=e.clientX;startW=sb.offsetWidth;
      handle.classList.add('active');
      document.addEventListener('mousemove',onResize);
      document.addEventListener('mouseup',stopResize);
    });
    function onResize(e){
      if(!resizing)return;
      const newW=Math.min(700,Math.max(300,startW+(e.clientX-startX)));
      sb.style.width=newW+'px';
    }
    function stopResize(){
      resizing=false;handle.classList.remove('active');
      document.removeEventListener('mousemove',onResize);
      document.removeEventListener('mouseup',stopResize);
      localStorage.setItem('sidebar_width',sb.offsetWidth);
    }
  }
  initMapSidebarDragDrop();
}
// v4.3.4: Drag and drop para cart\xf5es na sidebar com ghost + drop indicator
function initMapSidebarDragDrop(){
  const cards=document.querySelectorAll('#ms-client-list .ms-client[data-msstop]');
  let msDrag=null;
  let ghostEl=null;
  let dropIndicator=null;
  const DRAG_THRESHOLD=8;
  // v4.8.3: Flag de supressao que sobrevive entre mouseup e click
  // mouseup seta _msSuppressClick=true, click verifica e limpa
  let _msSuppressClick=false;
  cards.forEach(card=>{
    card.addEventListener('mousedown',e=>{
      if(e.target.closest('button'))return;
      const stop=parseInt(card.dataset.msstop);
      // v4.8.3: Rastrear startTime para distinguir click de drag abortado
      msDrag={stop,startX:e.clientX,startY:e.clientY,card,started:false,overStop:null,overHalf:null,startTime:Date.now()};
      _msSuppressClick=false;
      document.addEventListener('mousemove',msMove);
      document.addEventListener('mouseup',msEnd);
    });
    card.addEventListener('click',e=>{
      // v4.8.3: 3 camadas de protecao contra falso positivo
      // 1) Flag de supressao setada no mouseup (sobrevive ao event order mouseup→click)
      if(_msSuppressClick){_msSuppressClick=false;return;}
      // 2) Drag foi iniciado (>8px de movimento)
      if(msDrag&&msDrag.started)return;
      if(e.target.closest('.ms-client-del'))return;
      const cid=card.dataset.clientid;
      if(cid)editC(parseFloat(cid));
      else focusMapMarker(parseInt(card.dataset.msstop));
    });
  });
  function msMove(e){
    if(!msDrag)return;
    const dx=Math.abs(e.clientX-msDrag.startX);
    const dy=Math.abs(e.clientY-msDrag.startY);
    if(!msDrag.started&&(dx>DRAG_THRESHOLD||dy>DRAG_THRESHOLD)){
      msDrag.started=true;
      msDrag.card.classList.add('dragging');
      // Create ghost element
      ghostEl=msDrag.card.cloneNode(true);
      ghostEl.classList.add('drag-ghost');
      ghostEl.style.cssText='position:fixed;pointer-events:none;opacity:.8;z-index:10000;box-shadow:0 5px 15px rgba(0,0,0,.3);width:'+msDrag.card.offsetWidth+'px';
      document.body.appendChild(ghostEl);
      // Create drop indicator
      dropIndicator=document.createElement('div');
      // v4.3.7: Limitar linha indicadora à largura da sidebar
      const sidebarEl=document.querySelector('.map-sidebar');
      const sbRect=sidebarEl?sidebarEl.getBoundingClientRect():null;
      dropIndicator.style.cssText='position:fixed;height:2px;background:#6C5CE7;z-index:9999;pointer-events:none;display:none;left:'+(sbRect?sbRect.left+'px':'0')+';width:'+(sbRect?sbRect.width+'px':'100%');
      document.body.appendChild(dropIndicator);
    }
    if(!msDrag.started)return;
    e.preventDefault();
    // Move ghost
    if(ghostEl){
      ghostEl.style.left=e.clientX-ghostEl.offsetWidth/2+'px';
      ghostEl.style.top=e.clientY-20+'px';
    }
    // v4.7.3: Auto-scroll dentro da sidebar do mapa durante drag
    const sidebarScroll=document.querySelector('.map-sidebar');
    if(sidebarScroll){
      const sbR=sidebarScroll.getBoundingClientRect();
      const SZ=60;
      if(e.clientY<sbR.top+SZ)sidebarScroll.scrollBy(0,-8);
      else if(e.clientY>sbR.bottom-SZ)sidebarScroll.scrollBy(0,8);
    }
    const allCards=[...document.querySelectorAll('#ms-client-list .ms-client[data-msstop]')];
    allCards.forEach(c=>c.classList.remove('drag-over-top','drag-over-bottom'));
    for(const c of allCards){
      const r=c.getBoundingClientRect();
      if(e.clientY>r.top&&e.clientY<r.bottom){
        const si=parseInt(c.dataset.msstop);
        if(si!==msDrag.stop){
          const mid=r.top+r.height/2;
          const isTop=e.clientY<mid;
          if(dropIndicator){
            dropIndicator.style.display='block';
            dropIndicator.style.top=(isTop?r.top:r.bottom)+'px';
          }
          msDrag.overStop=si;msDrag.overHalf=isTop?'top':'bottom';
        }
        return;
      }
    }
    msDrag.overStop=null;
    if(dropIndicator)dropIndicator.style.display='none';
  }
  function msEnd(e){
    document.removeEventListener('mousemove',msMove);
    document.removeEventListener('mouseup',msEnd);
    if(!msDrag)return;
    // v4.8.3: Suprimir click se: drag iniciou OU segurou >200ms (tentativa de drag)
    const elapsed=Date.now()-msDrag.startTime;
    if(msDrag.started||elapsed>200){
      _msSuppressClick=true;
      // Limpar flag apos proximo tick (caso click nao dispare, ex: move pra fora do card)
      setTimeout(()=>{_msSuppressClick=false;},0);
    }
    if(ghostEl){ghostEl.remove();ghostEl=null;}
    if(dropIndicator){dropIndicator.remove();dropIndicator=null;}
    document.querySelectorAll('#ms-client-list .ms-client').forEach(c=>c.classList.remove('dragging','drag-over-top','drag-over-bottom'));
    if(msDrag.started&&msDrag.overStop!==null&&msDrag.overStop!==undefined&&msDrag.overStop!==msDrag.stop){
      let to=msDrag.overStop;
      if(msDrag.overHalf==='bottom')to++;
      if(to>msDrag.stop)to--;
      if(to!==msDrag.stop&&to>=0&&to<order.length){
        pushRouteState(); // v4.6.2: save state before reorder for undo
        const item=order.splice(msDrag.stop,1)[0];
        order.splice(to,0,item);
        // v4.6.9: Recalcular ETAs via cache (instantâneo) + Google Directions (async)
        if(recalcETAsFromCache()){renderC();toast(t('t.orderupd'),'ok');}
        else{renderC();toast(t('t.orderupd'),'ok');}
        recalcRouteFromOrder();updateMapSidebar();updateUndoBtn();
      }
    }
    msDrag=null;
  }
}
function focusMapMarker(stop){
  if(!gMarkers[stop]||!gMap)return;
  const mk=gMarkers[stop];
  const c=clients[order[stop]];
  if(!c)return;
  gMap.panTo(mk.position);
  gMap.setZoom(15);
  openMarkerInfoWindow(mk,c,stop);
}
function openMarkerInfoWindow(mk,c,stop){
  if(_activeInfoWindow)_activeInfoWindow.close();
  // v4.3.4: Use tag colors and improved layout
  const tagColor=_getTagColor(normalizeTipo(c.tipo)[0]);
  const tagLabel=_getTagLabel(normalizeTipo(c.tipo)[0]);
  const vd=c.valTipo==='medir'?'Medir':c.valTipo==='pago'?'Pago':c.val?'R$ '+fmtBRL(c.val):'';
  let details=[];
  if(c.tel)details.push('\u260E '+c.tel);
  if(c.qtd)details.push(c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':''));
  if(vd)details.push(vd);
  const jl=c.janela&&c.janela!=='livre'?(c.janela==='manha'?'At\xe9 12h':c.janela==='tarde'?'Ap\xf3s 12h':c.hi+'\u2013'+c.hf):'';
  let html='<div style="font-family:\'Plus Jakarta Sans\',sans-serif;padding:0;min-width:200px;max-width:280px">'
    +'<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid '+tagColor+'20">'
      +'<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:'+tagColor+';color:#fff;font-size:11px;font-weight:700;flex-shrink:0">'+(stop+1)+'</span>'
      +'<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:#1e1b4b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+c.nome+'</div>'
      +'<span style="font-size:10px;font-weight:600;color:'+tagColor+';text-transform:uppercase;letter-spacing:.04em">'+tagLabel+'</span></div>'
    +'</div>'
    +'<div style="padding:8px 10px;font-size:11px;color:#555;line-height:1.5">'
      +'<div style="color:#333;font-weight:500;margin-bottom:4px">'+c.endereco+(c.complemento?' \u2014 '+c.complemento:'')+'</div>';
  if(details.length)html+='<div style="color:#666;font-size:10px;margin-bottom:4px">'+details.join(' \xB7 ')+'</div>';
  if(c.estT)html+='<div style="color:'+tagColor+';font-weight:600;margin-bottom:3px">Chegada: '+c.estT+'</div>';
  if(jl)html+='<div style="color:#FF6B35;font-weight:600;font-size:10px;margin-bottom:3px">Janela: '+jl+'</div>';
  if(c.obs)html+='<div style="color:#888;font-style:italic;font-size:10px;margin-top:4px">'+c.obs+'</div>';
  html+='</div></div>';
  const iw=new google.maps.InfoWindow({content:html,maxWidth:300});
  iw.open({anchor:mk,map:gMap});
  _activeInfoWindow=iw;
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(mapIsFullscreen){toggleMapFullscreen();return;}
    if(document.getElementById('completion-overlay').classList.contains('on')){closeCompletion();return;}
    document.querySelectorAll('.mbg.on').forEach(m=>m.classList.remove('on'));
  }
});


// ════════════════════════════════════════════════════════════
// SECTION: GOOGLE MAPS
// ════════════════════════════════════════════════════════════

// ---- GOOGLE MAPS ----
const GKEY='AIzaSyDquzcZIaEaofLt0rgLwutGOoSg4BRC3NM';
const GMAP_ID=cfg.mapid||'DEMO_MAP_ID';
// Helper: cria AdvancedMarkerElement com visual circular (substitui google.maps.Marker deprecated)
function createAdvMarker({position,map,label,fillColor,strokeColor,strokeWeight,onClick}){
  const el=document.createElement('div');
  el.style.cssText='width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;cursor:pointer;background:'+fillColor+';border:'+(strokeWeight||2)+'px solid '+(strokeColor||'#fff')+';box-shadow:0 2px 6px rgba(0,0,0,.3);';
  if(label)el.textContent=label;
  const mk=new google.maps.marker.AdvancedMarkerElement({position,map,content:el});
  if(onClick)mk.addListener('gmp-click',onClick);
  return mk;
}
// v4.3.5: Criar marcador de partida/retorno com ícone de prédio/casa
function createBaseMarker({position,map,title,type}){
  const el=document.createElement('div');
  const buildingSvg='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><circle cx="9" cy="7" r=".5" fill="#555"/><circle cx="15" cy="7" r=".5" fill="#555"/><circle cx="9" cy="11" r=".5" fill="#555"/><circle cx="15" cy="11" r=".5" fill="#555"/></svg>';
  const houseSvg='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  if(type==='ambos'){
    el.style.cssText='width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:1px;cursor:pointer;background:#fff;border:2px solid rgba(0,0,0,.2);box-shadow:0 2px 6px rgba(0,0,0,.15)';
    el.innerHTML=buildingSvg.replace('width="14"','width="11"').replace('height="14"','height="11"')+houseSvg.replace('width="14"','width="11"').replace('height="14"','height="11"');
  } else {
    el.style.cssText='width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;border:2px solid rgba(0,0,0,.2);box-shadow:0 2px 6px rgba(0,0,0,.15)';
    el.innerHTML=type==='partida'?buildingSvg:houseSvg;
  }
  el.title=title||'';
  const mk=new google.maps.marker.AdvancedMarkerElement({position,map,content:el});
  return mk;
}
// v5.8.41: Flag para restaurar mapa após refresh (quando Google Maps inicializa depois dos clientes)
let _pendingMapRestore=false;

// v5.8.40: Substitui google.maps.visualization.HeatmapLayer (depreciado mai/2025, remoção mai/2026)
// Implementação canvas pura via OverlayView — sem dependência da biblioteca visualization
let _HeatmapCls=null;
function _makeHeatmap(opts){
  if(!_HeatmapCls){
    _HeatmapCls=class extends google.maps.OverlayView{
      constructor(o){super();this._data=o.data||[];this._radius=o.radius||35;this._gradient=o.gradient||null;this._cvs=null;this._lis=[];if(o.map)this.setMap(o.map);}
      onAdd(){
        const c=document.createElement('canvas');
        c.style.cssText='position:absolute;top:0;left:0;pointer-events:none';
        this.getPanes().overlayLayer.appendChild(c);this._cvs=c;
        const redraw=()=>this._draw();
        const m=this.getMap();
        // v5.8.41: redraw no tilesloaded resolve heatmap em branco no primeiro load
        this._lis=[
          google.maps.event.addListener(m,'bounds_changed',redraw),
          google.maps.event.addListener(m,'zoom_changed',redraw),
          google.maps.event.addListenerOnce(m,'tilesloaded',()=>{setTimeout(()=>this._draw(),100);}),
        ];
      }
      draw(){this._draw();}
      _draw(){
        if(!this._cvs)return;const proj=this.getProjection();if(!proj)return;
        const m=this.getMap();const div=m.getDiv();
        const w=div.offsetWidth,h=div.offsetHeight;
        this._cvs.width=w;this._cvs.height=h;
        this._cvs.style.width=w+'px';this._cvs.style.height=h+'px';
        const ctx=this._cvs.getContext('2d');ctx.clearRect(0,0,w,h);
        const stops=this._gradient||['rgba(108,92,231,0)','rgba(108,92,231,.25)','rgba(108,92,231,.55)','rgba(108,92,231,.9)'];
        this._data.forEach(pt=>{
          let lat,lng,wt=1;
          if(pt instanceof google.maps.LatLng){lat=pt.lat();lng=pt.lng();}
          else if(pt&&pt.location){lat=typeof pt.location.lat==='function'?pt.location.lat():pt.location.lat;lng=typeof pt.location.lng==='function'?pt.location.lng():pt.location.lng;wt=pt.weight||1;}
          else{lat=pt[0];lng=pt[1];}
          const px=proj.fromLatLngToDivPixel(new google.maps.LatLng(lat,lng));if(!px)return;
          const r=this._radius*(0.5+Math.min(1.5,wt*0.8));
          const g=ctx.createRadialGradient(px.x,px.y,0,px.x,px.y,r);
          stops.forEach((s,i)=>{
            const pos=i/(stops.length-1);
            const mo=s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if(mo){const a=parseFloat(mo[4]||1)*Math.min(1,.2+wt*.5);g.addColorStop(pos,'rgba('+mo[1]+','+mo[2]+','+mo[3]+','+a.toFixed(2)+')');}
            else g.addColorStop(pos,s);
          });
          ctx.beginPath();ctx.arc(px.x,px.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        });
      }
      onRemove(){this._lis.forEach(l=>google.maps.event.removeListener(l));this._lis=[];if(this._cvs){this._cvs.parentNode?.removeChild(this._cvs);this._cvs=null;}}
    };
  }
  return new _HeatmapCls(opts);
}
function initGoogleMaps(){
  const mapEl=document.getElementById('map');
  if(mapEl){mapEl.style.display='block';document.getElementById('mph').style.display='none';
    document.getElementById('map-expand-btn').style.display='flex';
    gMap=new google.maps.Map(mapEl,{center:{lat:-23.55,lng:-46.63},zoom:12,mapId:GMAP_ID,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,zoomControl:false,rotateControl:false,scaleControl:false,keyboardShortcuts:false,gestureHandling:'greedy'});
    // v4.5.1: Multiple resize triggers to fix gray tiles on small containers
    const _triggerResize=()=>{if(gMap)google.maps.event.trigger(gMap,'resize');};
    google.maps.event.addListenerOnce(gMap,'tilesloaded',_triggerResize);
    setTimeout(_triggerResize,300);setTimeout(_triggerResize,1000);setTimeout(_triggerResize,3000);
    // Centralizar no endereço base se configurado
    if(cfg.base&&cfg.base.trim()){
      (async()=>{try{const a=await _resolveGeoAnchor();if(a&&gMap){gMap.panTo({lat:a.lat,lng:a.lng});}}catch(e){}})();
    }
  }
  /* v5.5.0: heatmap (Mapa de Clientes) criado lazily em renderDashStats quando o div esta visivel */
  // v5.8.41: Restaurar mapa/rota automaticamente após refresh de página
  if(_pendingMapRestore&&clients.length&&order.length){
    _pendingMapRestore=false;
    // Aguarda mapa estar pronto (tiles carregados) antes de chamar recalcRouteFromOrder
    google.maps.event.addListenerOnce(gMap,'tilesloaded',()=>{
      setTimeout(()=>{
        if(gMap&&order.length&&clients.filter(c=>c.lat&&c.lng).length>=2){
          console.log('[RESTORE-MAP] Redesenhando rota no mapa após restauração...');
          recalcRouteFromOrder();
        }
      },200);
    });
  }
}
function initLeafMap(){}
// v4.9.1: Invalidar cache de geocoding quando versão muda (corrige endereços cacheados errados)
(function(){
  const GEO_CACHE_VER='5.4.8';
  if(localStorage.getItem('_geoCacheVer')!==GEO_CACHE_VER){
    let cleared=0;
    for(let i=localStorage.length-1;i>=0;i--){
      const k=localStorage.key(i);
      if(k&&k.startsWith('geo_')){localStorage.removeItem(k);cleared++;}
    }
    localStorage.setItem('_geoCacheVer',GEO_CACHE_VER);
    if(cleared)console.log('[GEO] Cache invalidado (v'+GEO_CACHE_VER+'): '+cleared+' entradas removidas');
  }
})();
const _geoCache={};
// v4.8.0: Pre-geocoding — geocodifica cliente em background assim que adicionado
// v5.8.12: _preGeocodeAmbiguityCheck — verifica ambiguidade para um cliente já geocodificado
// Usado quando preGeocode detecta que o cliente JÁ tem coords (cache hit) e não passou pelo
// fire-and-forget do nominatim(). Sem isso, clientes re-importados nunca receberiam o badge.
function _preGeocodeAmbiguityCheck(client){
  if(!client.lat||!client.lng||client._addrPending||_addrChoiceGet(client.endereco,client.nome))return;
  const baseAddr=_extractBaseAddr(client.endereco);
  if(!baseAddr)return;
  const _cr=client;
  const parts=_cr.endereco.split('\u2014').map(p=>p.trim()).filter(Boolean);
  const sb=parts.length>=3?parts[parts.length-2]:(parts.length===2?'':'');
  const sc=parts.length>=2?parts[parts.length-1]:(_cr._cidade||'');
  _checkGeoAmbiguity(_cr.lat,_cr.lng,sb,sc,baseAddr).then(ambig=>{
    if(ambig&&Array.isArray(ambig)&&!_cr._addrPending){
      _cr._addrPending=true;_cr._addrResults=ambig;
      // Marca no sessionStorage para o startup audit não duplicar
      try{const k='rota_geo_audit_session';const s=new Set(JSON.parse(sessionStorage.getItem(k)||'[]'));s.add(String(_cr.id));sessionStorage.setItem(k,JSON.stringify([...s]));}catch(e){}
      renderC();autoSaveRoute();
    }
  }).catch(()=>{});
}
function preGeocode(client){
  if(!client||!client.endereco)return;
  // v5.8.12: Cliente já tem coords → geocoding veio do cache. Verificar ambiguidade diretamente,
  // pois o cache hit bypassa o fire-and-forget do nominatim() e o badge nunca aparecia.
  if(client.lat&&client.lng){
    _preGeocodeAmbiguityCheck(client);
    return;
  }
  // Cliente sem coords → geocodificar (nominatim dispara a verificação de ambiguidade internamente)
  nominatim(client.endereco,client).then(r=>{
    if(r){client.lat=r.lat;client.lng=r.lng;if(r.cidade)client._cidade=r.cidade;
      if(r.route){client.endereco=_fmtAddrFromGeo(r,client.endereco);}
      else if(r.bairro||r.cidade){// v5.8.24: resultado de memória — atualizar texto com bairro/cidade corretos
        const base=(client.endereco.split('\u2014')[0]||client.endereco).trim();
        let nAddr=base;if(r.bairro)nAddr+=' \u2014 '+titleCase(r.bairro);if(r.cidade)nAddr+=' \u2014 '+titleCase(r.cidade);
        if(nAddr!==client.endereco)client.endereco=nAddr;
      }
      console.log('[PRE-GEO] '+client.nome+' geocodificado e endereço normalizado');
      autoSaveRoute();renderC();
    } else if(client._addrPending){
      renderC();autoSaveRoute();
    }
  }).catch(()=>{});
}
// v4.3.1: Geocodificação dinâmica baseada no endereço de partida do usuário
// Âncora = endereço base configurado. Bounds = raio de ~80km ao redor da âncora.
let _geoAnchor=null; // {lat,lng,state,city} — resolvido a partir de cfg.base
const _GEO_RADIUS=0.4; // v4.9.1: ~45km em graus (antes 0.7/~80km — permitia Jacareí)

async function _resolveGeoAnchor(){
  if(_geoAnchor)return _geoAnchor;
  const base=cfg.base;
  if(!base)return null;
  // v5.4.8: Se cidade configurada explicitamente, usar como sufixo garantido
  const cidadeExplicita=cfg.cidade?cfg.cidade.trim():'';
  const ufExplicita=cfg.uf?cfg.uf.trim().toUpperCase():'';
  const suffix=cidadeExplicita?(', '+cidadeExplicita+(ufExplicita?', '+ufExplicita:'')+', Brasil'):', Brasil';
  try{
    // v4.8.4: Timeout de 6s para resolver ancora
    const _acCtrl=new AbortController();const _acTid=setTimeout(()=>_acCtrl.abort(),6000);
    const d=await _geocodeProxy('address='+encodeURIComponent(base+suffix)+'&region=br',_acCtrl.signal);
    clearTimeout(_acTid);
    if(d&&d.status==='OK'&&d.results[0]){
      const loc=d.results[0].geometry.location;
      const comps=d.results[0].address_components;
      const state=ufExplicita||(comps.find(c=>c.types.includes('administrative_area_level_1'))||{}).short_name||'';
      // v5.4.8: cidade explicita tem prioridade — evita Google retornar cidade errada
      const city=cidadeExplicita||(comps.find(c=>c.types.includes('administrative_area_level_2'))||comps.find(c=>c.types.includes('locality'))||{}).long_name||'';
      _geoAnchor={lat:loc.lat,lng:loc.lng,state,city};
      console.log('[GEO-ANCHOR] Base resolvida:',city+', '+state,'(',loc.lat.toFixed(4)+','+loc.lng.toFixed(4)+')'+(cidadeExplicita?' [cidade configurada]':''));
      return _geoAnchor;
    }
  }catch(e){console.warn('[GEO-ANCHOR] Falha ao resolver base:',e);}
  return null;
}
function _isNearAnchor(lat,lng){
  if(!_geoAnchor)return true; // Sem âncora, aceita qualquer resultado
  return Math.abs(lat-_geoAnchor.lat)<=_GEO_RADIUS&&Math.abs(lng-_geoAnchor.lng)<=_GEO_RADIUS;
}
function _getAnchorBounds(){
  if(!_geoAnchor)return '';
  const lat=_geoAnchor.lat,lng=_geoAnchor.lng,r=_GEO_RADIUS;
  return '&bounds='+(lat-r)+','+(lng-r)+'|'+(lat+r)+','+(lng+r);
}
function _getAnchorComponents(){
  if(!_geoAnchor||!_geoAnchor.state)return '&components=country:BR';
  return '&components=administrative_area:'+_geoAnchor.state+'|country:BR';
}
// v4.3.3: Sufixo din\xe2mico para endere\xe7os enviados ao Google Directions (escala Brasil)
function _getAddrSuffix(){
  if(_geoAnchor&&_geoAnchor.city&&_geoAnchor.state)return ', '+_geoAnchor.city+', '+_geoAnchor.state+', Brasil';
  if(_geoAnchor&&_geoAnchor.state)return ', '+_geoAnchor.state+', Brasil';
  return ', Brasil';
}
// v4.3.3: Gerar waypoint para Google Directions usando coordenadas quando dispon\xedveis
function _waypointFor(c){
  if(c.lat&&c.lng)return{location:new google.maps.LatLng(c.lat,c.lng),stopover:true};
  return{location:c.endereco+_getAddrSuffix(),stopover:true};
}
function _extractGeoResult(result){
  const loc=result.geometry.location;
  const comps=result.address_components;
  const route=(comps.find(c=>c.types.includes('route'))||{}).long_name||'';
  const streetNum=(comps.find(c=>c.types.includes('street_number'))||{}).long_name||'';
  const bairro=(comps.find(c=>c.types.includes('sublocality_level_1'))||comps.find(c=>c.types.includes('sublocality'))||comps.find(c=>c.types.includes('neighborhood'))||{}).long_name||'';
  const cidade=(comps.find(c=>c.types.includes('administrative_area_level_2'))||comps.find(c=>c.types.includes('locality'))||{}).long_name||'';
  return {lat:loc.lat,lng:loc.lng,display:result.formatted_address,route,streetNum,bairro,cidade};
}
// v5.8.8: nominatim — verificação de ambiguidade via chamada sem bounds
async function nominatim(addr,client){
  // v5.8.38: BUG-01 — abandona endereços que falharam demais (evita loop)
  if(!_geoFailOk(addr)){return null;}
  // v5.8.13: helper para disparar ambiguidade em background em qualquer cache hit
  function _fireAmbigCheck(result){
    if(!client||_addrChoiceGet(addr,client.nome))return;
    const baseAddr=_extractBaseAddr(addr);if(!baseAddr)return;
    const _cr=client,_res=result;
    _checkGeoAmbiguity(_res.lat,_res.lng,_res.bairro,_res.cidade,baseAddr).then(ambig=>{
      if(ambig&&Array.isArray(ambig)&&!_cr._addrPending){
        _cr._addrPending=true;_cr._addrResults=ambig;
        try{const k='rota_geo_audit_session';const s=new Set(JSON.parse(sessionStorage.getItem(k)||'[]'));s.add(String(_cr.id));sessionStorage.setItem(k,JSON.stringify([...s]));}catch(e){}
        renderC();autoSaveRoute();
      }
    }).catch(()=>{});
  }
  // v5.8.24: Memória explícita do usuário tem PRIORIDADE sobre qualquer cache
  const mem=_addrChoiceGet(addr,client?.nome);
  if(mem){
    console.log('[GEO-MEM] '+addr+' → '+[mem.bairro,mem.cidade].filter(Boolean).join(', ')+' (memória)');
    // Evictar cache obsoleto que possa ter as coordenadas erradas
    localStorage.removeItem('geo_'+addr);
    delete _geoCache[addr];
    _geoCache[addr]=mem;return mem;
  }
  if(_geoCache[addr]){_fireAmbigCheck(_geoCache[addr]);return _geoCache[addr];}
  const cached=localStorage.getItem('geo_'+addr);
  if(cached){const c=JSON.parse(cached);_geoCache[addr]=c;_fireAmbigCheck(c);return c;}
  await _resolveGeoAnchor();
  // v5.8.44: GEOCODING MULTI-ESTRATÉGIA para endereços incompletos
  // Problema: "Ulisses Guimarães" (incompleto, deveria ser "Rua Doutor Ulisses Guimarães")
  // "—" no meio da query confunde o Google → normalizar substituindo por ","
  // Estratégia: 3 tentativas em cascata, parar na primeira que retornar OK
  const _hasDash=addr.includes('\u2014');

  // Extrai cidade provável do último segmento "—" (ex: "Aciban Mauá" → "Mauá")
  let _cityHint='';
  if(_hasDash){
    const _parts=addr.split('\u2014');
    const _last=(_parts[_parts.length-1]||'').trim();
    const _words=_last.split(/\s+/).filter(w=>w.length>2&&/^[A-ZÁÉÍÓÚÀÂÃÊÕÇ]/u.test(w));
    _cityHint=_words[_words.length-1]||''; // última palavra capitalizada = provável cidade
  }
  // Endereço normalizado para query: "—" → ","
  const _qAddr=_hasDash?addr.replace(/\s*\u2014\s*/g,', '):addr;
  // Parte base (antes do primeiro "—") para fallbacks
  const _baseAddr=_hasDash?addr.split('\u2014')[0].trim():addr;

  // Monta as estratégias de query em ordem de especificidade
  const _stateStr=_geoAnchor?.state||'';
  const _queries=[
    // 1ª: addr normalizado + cidade extraída do "—" + estado (melhor pista geográfica)
    _cityHint&&_stateStr ? _qAddr+', '+_cityHint+', '+_stateStr+', Brasil' : null,
    // 2ª: addr normalizado + apenas estado (genérico)
    _stateStr ? _qAddr+', '+_stateStr+', Brasil' : null,
    // 3ª: addr normalizado + âncora city+state (comportamento pré-v5.8.40, como fallback)
    _geoAnchor?.city&&_stateStr ? _qAddr+', '+_geoAnchor.city+', '+_stateStr+', Brasil' : null,
    // 4ª: somente base (rua+número) + cidade extraída — para endereços com bairro verbose
    _cityHint&&_baseAddr&&_baseAddr!==addr ? _baseAddr+', '+_cityHint+(_stateStr?', '+_stateStr:'')+', Brasil' : null,
    // 5ª: raw + ", Brasil" sem qualquer filtro geográfico (último recurso)
    _qAddr+', Brasil',
  ].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i); // remove nulls e duplicatas

  const _runQuery=async(q,extraParams)=>{
    try{
      const _c=new AbortController();const _t=setTimeout(()=>_c.abort(),6000);
      const d=await _geocodeProxy('address='+encodeURIComponent(q)+'&region=br'+(extraParams||''),_c.signal);
      clearTimeout(_t);
      return d;
    }catch(e){return null;}
  };

  const _saveAndReturn=async(result)=>{
    _geoCache[addr]=result;try{localStorage.setItem('geo_'+addr,JSON.stringify(result));}catch(e){}
    _geoFailReset(addr);
    if(!_isNearAnchor(result.lat,result.lng))console.warn('[GEO] '+addr+' resolveu LONGE da âncora: '+result.display);
    if(client&&!_addrChoiceGet(addr,client.nome)){
      const baseAddr=_extractBaseAddr(addr);
      if(baseAddr){
        const _cr=client,_res=result;
        _checkGeoAmbiguity(_res.lat,_res.lng,_res.bairro,_res.cidade,baseAddr).then(ambig=>{
          if(ambig&&Array.isArray(ambig)&&!_cr._addrPending){
            _cr._addrPending=true;_cr._addrResults=ambig;
            try{const k='rota_geo_audit_session';const s=new Set(JSON.parse(sessionStorage.getItem(k)||'[]'));s.add(String(_cr.id));sessionStorage.setItem(k,JSON.stringify([...s]));}catch(e){}
            renderC();autoSaveRoute();
          }
        }).catch(()=>{});
      }
    }
    return result;
  };

  try{
    // Tentativa com bounds + components (mais restrita, só âncora)
    for(let qi=0;qi<_queries.length;qi++){
      const q=_queries[qi];
      // Nas primeiras tentativas usa bounds; nas últimas abre o filtro
      const extraParams=qi<3?(_getAnchorBounds()+_getAnchorComponents()):('&components=country:BR');
      const d=await _runQuery(q,extraParams);
      if(!d||d.status==='ZERO_RESULTS')continue;
      if(d.status==='OK'&&d.results?.length){
        const nearResults=d.results.filter(r=>_isNearAnchor(r.geometry.location.lat,r.geometry.location.lng));
        const best=(nearResults.length?nearResults:d.results)[0];
        const result=_extractGeoResult(best);
        console.log('[GEO] '+addr+' → '+result.cidade+' (estratégia '+(qi+1)+'/'+_queries.length+': "'+q.slice(-40)+'")');
        return await _saveAndReturn(result);
      }
    }
  }catch(e){console.warn('Geocoding falhou:',addr,e);_geoFailInc(addr);}
  _geoFailInc(addr);
  return null;
}
// v5.8.44: Retenta geocoding para cliente específico — limpa cache e tenta novamente
async function _retryGeocode(clientId){
  const c=clients.find(x=>x.id===clientId);if(!c)return;
  // Limpa cache de memória e localStorage
  const addr=c.endereco;
  delete _geoCache[addr];
  try{localStorage.removeItem('geo_'+addr);}catch(e){}
  // Reset do contador de falhas para permitir nova tentativa
  if(addr){const k=addr.slice(0,60);delete _geoFailCount[k];}
  toast('Tentando localizar "'+c.nome+'"…','ok');
  const result=await nominatim(addr,c);
  if(result){
    c.lat=result.lat;c.lng=result.lng;c._cidade=result.cidade||null;
    c._addrPending=false;
    renderC();updStats();autoSaveRoute();
    toast('Localizado: '+result.display,'ok');
  } else {
    toast('Ainda não encontrado. Tente editar o endereço.','warn');
  }
}
async function nominatimReverse(lat,lng){
  try{
    const d=await _geocodeProxy('latlng='+lat+','+lng+'&language=pt-BR');
    if(d.status==='OK'&&d.results[0]){
      const comps=d.results[0].address_components;
      return {address:{suburb:(comps.find(c=>c.types.includes('sublocality_level_1'))||comps.find(c=>c.types.includes('sublocality'))||{}).long_name||''}};
    }
  }catch(e){}
  return {address:{}};
}
function sortByWindow(){
  const sc=c=>{if(c.janela==='manha')return 0;if(c.janela==='custom'&&c.hi<'12:00')return 0.5;if(c.janela==='livre')return 1;if(c.janela==='custom')return 1.5;return 2;};
  order.sort((a,b)=>{const ca=clients[a],cb=clients[b];const s=sc(ca)-sc(cb);if(s)return s;return normalizeTipo(ca.tipo).includes(_resolveTagId('coleta'))?-1:1;});
}

// Calcula deadline em minutos desde meia-noite para um cliente com janela de horário
function clientDeadlineMin(c){
  if(c.janela==='manha') return 12*60; // até 12:00
  if(c.janela==='custom'&&c.hf){
    const p=c.hf.split(':');return parseInt(p[0])*60+parseInt(p[1]||0);
  }
  return 24*60; // sem restrição
}

// v4.8.5: Wrapper de timing para capturar dead time percebido
let _calcRouteClickTime=0;
function calcRouteClick(){
  _calcRouteClickTime=performance.now();
  console.log('[PERF] Botão "Gerar rota" clicado — timestamp: '+Math.round(_calcRouteClickTime));
  calcRoute();
}
async function calcRoute(){
  if(_calcRouteClickTime>0)console.log('[PERF] calcRoute() iniciou — delta desde clique: '+Math.round(performance.now()-_calcRouteClickTime)+'ms');
  if(!clients.length)return;
  if(!cfg.base||!cfg.base.trim()){
    toast(t('err.start_addr'),'err');
    showConfirm(t('confirm.base_addr_title'),t('confirm.base_addr_msg'),
      ()=>{closeModal('confirm-modal');goPage('cfg',document.querySelectorAll('.ntab')[4]);});
    g('confirm-ok').textContent='Ir para Configura\xE7\xF5es';
    return;
  }
  g('rp').classList.add('on');
  g('route-btn').disabled=true;
  try{
    // v4.8.1: INSTRUMENTACAO DE PERFORMANCE — timing de cada etapa
    const _perf={start:performance.now()};
    console.log('[CALC-ROUTE] >>> Iniciando ('+clients.length+' clientes)');
    // v4.3.3: Resolver ancora geografica antes de calcular rota
    await _resolveGeoAnchor();
    _perf.anchor=performance.now();
    console.log('[CALC-ROUTE] 1/6 Ancora: '+Math.round(_perf.anchor-_perf.start)+'ms');
    // v4.8.0: Geocode clients in parallel batches (5 at a time) instead of sequential
    const notFound=[];
    const needGeo=clients.filter(c=>!c.lat||!c.lng);
    const GEO_BATCH=5;
    for(let b=0;b<needGeo.length;b+=GEO_BATCH){
      const batch=needGeo.slice(b,b+GEO_BATCH);
      const results=await Promise.all(batch.map(c=>nominatim(c.endereco).catch(()=>null)));
      results.forEach((r,i)=>{
        if(r){batch[i].lat=r.lat;batch[i].lng=r.lng;if(r.cidade)batch[i]._cidade=r.cidade;
          if(r.route){batch[i].endereco=_fmtAddrFromGeo(r,batch[i].endereco);}
          else if(r.bairro||r.cidade){// v5.8.24: resultado de memória — atualizar texto do endereço com bairro/cidade corretos
            const base=(batch[i].endereco.split('\u2014')[0]||batch[i].endereco).trim();
            let nAddr=base;if(r.bairro)nAddr+=' \u2014 '+titleCase(r.bairro);if(r.cidade)nAddr+=' \u2014 '+titleCase(r.cidade);
            if(nAddr!==batch[i].endereco)batch[i].endereco=nAddr;
          }}
        else notFound.push(batch[i].nome);
      });
      // Rate limit: 200ms pause between batches (not between each client)
      if(b+GEO_BATCH<needGeo.length)await new Promise(res=>setTimeout(res,200));
    }
    _perf.geocode=performance.now();
    console.log('[CALC-ROUTE] 2/6 Geocoding ('+needGeo.length+' precisavam): '+Math.round(_perf.geocode-_perf.anchor)+'ms');
    if(notFound.length)toast(t('err.addr_not_found')+': '+notFound.join(', '),'warn');
    const geocodedIdx=[];
    for(let i=0;i<clients.length;i++){if(clients[i].lat&&clients[i].lng)geocodedIdx.push(i);}
    const geocoded=geocodedIdx.map(i=>clients[i]);
    if(!geocoded.length){toast(t('e.noaddr'),'err');return;}
    if(geocoded.length===1){
      gMap.setCenter({lat:geocoded[0].lat,lng:geocoded[0].lng});gMap.setZoom(15);
      createAdvMarker({position:{lat:geocoded[0].lat,lng:geocoded[0].lng},map:gMap,label:'1',fillColor:'#6C5CE7'});
      order=geocodedIdx.slice();
      estimateTimesSimple();renderC();return;
    }
    const baseAddr=cfg.base;
    const retAddr=cfg.retaddr||baseAddr;
    const saidaMin=ts(cfg.saida||'10:00')/60; // horário de saída em minutos
    const tempoParada=cfg.tempo||10; // minutos por parada
    // ── v4.6.6: MOTOR DE OTIMIZAÇÃO v2 — VRPTW com SA ──
    _routeMode=getRouteMode();
    _routeResults={time:null,distance:null};
    // v4.8.0: Resolver base e retorno em PARALELO
    let baseCoords,retCoords;
    const [baseGeo,retGeo]=await Promise.all([nominatim(baseAddr),nominatim(retAddr)]);
    if(baseGeo){baseCoords={lat:baseGeo.lat,lng:baseGeo.lng};}
    else{toast(t('err.start_addr'),'err');return;}
    retCoords=retGeo?{lat:retGeo.lat,lng:retGeo.lng}:{...baseCoords};
    _perf.baseRet=performance.now();
    console.log('[CALC-ROUTE] 3/6 Base+Retorno: '+Math.round(_perf.baseRet-_perf.geocode)+'ms');
    // Otimizar via motor v2 (matriz + heurísticas + SA)
    toast(t('msg.optimizing'),'');
    const optV2=await optimizeRouteV2(geocodedIdx,baseCoords,retCoords);
    _perf.optimize=performance.now();
    console.log('[CALC-ROUTE] 4/6 OptimizeV2 (matrix+SA): '+Math.round(_perf.optimize-_perf.baseRet)+'ms');
    // Aplicar ordem otimizada
    const noCoords=[];
    for(let i=0;i<clients.length;i++){if(!clients[i].lat||!clients[i].lng)noCoords.push(i);}
    // v5.8.38: Retry geocoding para clientes sem coordenadas (endereço simplificado: sem sufixo de bairro)
    if(noCoords.length){
      const suffix=_getAddrSuffix?_getAddrSuffix():'';
      await Promise.allSettled(noCoords.map(async(i)=>{
        const c=clients[i];
        if(!c.endereco||c.endereco.length<8)return;
        if(!_geoRateOk())return;
        const baseAddr2=(c.endereco.split('\u2014')[0]||c.endereco).trim();
        const addrQuery=baseAddr2+(suffix?' '+suffix:'');
        try{
          const res=await _geocodeProxy('address='+encodeURIComponent(addrQuery)+'&region=br');
          if(res.status==='OK'&&res.results&&res.results[0]){
            const loc=res.results[0].geometry.location;
            c.lat=typeof loc.lat==='function'?loc.lat():loc.lat;
            c.lng=typeof loc.lng==='function'?loc.lng():loc.lng;
            if(!c.cep){const pc=res.results[0].address_components?.find(a=>a.types.includes('postal_code'));if(pc)c.cep=pc.long_name.replace(/\D/g,'');}
            console.log('[RETRY-GEO] \u2713 '+c.nome+' geocodificado: '+c.lat+','+c.lng);
          }
        }catch(e){console.warn('[RETRY-GEO] Falhou para '+c.nome+':',e.message);}
      }));
    }
    // Recalcular noCoords após tentativas de geocodificação
    const noCoords2=[];
    for(let i=0;i<clients.length;i++){if(!clients[i].lat||!clients[i].lng)noCoords2.push(i);}
    order=optV2.order.concat(noCoords2);
    // v5.8.33: Avisar sobre clientes ainda sem geocoding (após retry)
    if(noCoords2.length){
      const names=noCoords2.map(i=>clients[i].nome).filter(Boolean).join(', ');
      setTimeout(()=>toast(noCoords2.length+' cliente(s) sem endere\xE7o encontrado no mapa: '+names+'. Verifique o endere\xE7o deles.','warn'),800);
    }
    // Chamar Google Directions UMA VEZ com a ordem já otimizada (só pra renderizar mapa + ETAs exatos)
    const orderedGeo=order.filter(i=>clients[i].lat&&clients[i].lng).map(i=>clients[i]);
    const waypoints=orderedGeo.map(c=>_waypointFor(c));
    let dirResult;
    try{
      _perf.dirStart=performance.now();
      // v5.8.23: Tenta primeiro com tráfego em tempo real; se falhar (INVALID_REQUEST), retry sem drivingOptions
      const _dirReq={origin:baseAddr,destination:retAddr,waypoints,travelMode:google.maps.TravelMode.DRIVING,optimizeWaypoints:false,region:'BR'};
      try{
        dirResult=await Promise.race([
          new Promise((rOk,rErr)=>new google.maps.DirectionsService().route({..._dirReq,drivingOptions:{departureTime:new Date()}},(res,status)=>status==='OK'?rOk(res):rErr(new Error(status)))),
          new Promise((_,rErr)=>setTimeout(()=>rErr(new Error('TIMEOUT_10s')),10000))
        ]);
        console.log('[CALC-ROUTE] Directions com tráfego OK');
      }catch(trafficErr){
        console.warn('[ROTA] Directions com tráfego falhou ('+trafficErr.message+') → retry sem drivingOptions');
        dirResult=await Promise.race([
          new Promise((rOk,rErr)=>new google.maps.DirectionsService().route(_dirReq,(res,status)=>status==='OK'?rOk(res):rErr(new Error(status)))),
          new Promise((_,rErr)=>setTimeout(()=>rErr(new Error('TIMEOUT_10s')),10000))
        ]);
        console.log('[CALC-ROUTE] Directions básico OK (sem tráfego)');
      }
      _perf.dirEnd=performance.now();
      console.log('[CALC-ROUTE] 5/6 Google Directions: '+Math.round(_perf.dirEnd-_perf.dirStart)+'ms');
    }catch(dirErr){
      console.warn('[ROTA] Google Directions falhou:',dirErr.message,'→ usando estimativas da matriz');
      // Usar ETAs da matriz cacheada
      recalcETAsFromCache();
      renderC();updStats();saveHist();
      const urgCount=geocoded.filter(c=>clientDeadlineMin(c)<24*60).length;
      toast(t('msg.optimized_nomap')+(urgCount?' ('+urgCount+' '+t('t.with_window')+')':''),'ok');
      return; // Pular renderização do mapa
    }
    // Renderizar mapa com resultado do Google
    const legs=dirResult.routes[0].legs;
    const totalDistKm=legs.reduce((s,l)=>s+l.distance.value,0)/1000;
    const totalDurMin=legs.reduce((s,l)=>s+(l.duration_in_traffic||l.duration).value,0)/60; // v5.8.22
    console.log('[ROTA v2] Dist\xe2ncia:',totalDistKm.toFixed(1)+'km | Dura\xe7\xe3o:',totalDurMin.toFixed(0)+'min | Viola\xe7\xf5es SA:',optV2.eval.violations);
    if(gRoute)gRoute.setMap(null);gMarkers.forEach(m=>{if(m.map)m.map=null;});gMarkers=[];gBaseMarkers.forEach(m=>{if(m.map)m.map=null;});gBaseMarkers=[];
    gRoute=new google.maps.DirectionsRenderer({map:gMap,directions:dirResult,suppressMarkers:true,polylineOptions:{strokeColor:'#6C5CE7',strokeWeight:4,strokeOpacity:0.8}});
    // Atualizar coordenadas com posições resolvidas pelo Google
    orderedGeo.forEach((c,pos)=>{
      if(legs[pos]&&legs[pos].end_location){
        c.lat=legs[pos].end_location.lat();
        c.lng=legs[pos].end_location.lng();
      }
    });
    _routeTotalKm=totalDistKm;_routeTotalMin=totalDurMin;
    // v5.8.29: mapa cliente→parada real para alinhar numeração marcador com cartão
    const _ordGeoStopMap=new Map();
    order.forEach((ci,stopIdx)=>{if(clients[ci]&&clients[ci].lat&&clients[ci].lng)_ordGeoStopMap.set(clients[ci],stopIdx);});
    // Markers
    orderedGeo.forEach((c,pos)=>{
      const tipos=normalizeTipo(c.tipo);const fillColor=tipos.length?_getTagColor(tipos[0]):'#787878';
      const dlMin=clientDeadlineMin(c);const isUrg=dlMin<24*60;
      const stop=_ordGeoStopMap.has(c)?_ordGeoStopMap.get(c):pos;
      const mk=createAdvMarker({position:{lat:c.lat,lng:c.lng},map:gMap,label:String(stop+1),fillColor,strokeColor:isUrg?'#FF6B35':'#fff',strokeWeight:isUrg?3:2,onClick:()=>{openMarkerInfoWindow(mk,c,stop);}});
      gMarkers.push(mk);
    });
    // Marcadores base/retorno
    const origin=legs[0].start_location;
    const destination=legs[legs.length-1].end_location;
    if(origin&&destination){
      if(origin.lat()===destination.lat()&&origin.lng()===destination.lng()){
        gBaseMarkers.push(createBaseMarker({position:{lat:origin.lat(),lng:origin.lng()},map:gMap,title:t('map.departure_return'),type:'ambos'}));
      } else {
        gBaseMarkers.push(createBaseMarker({position:{lat:origin.lat(),lng:origin.lng()},map:gMap,title:t('map.departure'),type:'partida'}));
        gBaseMarkers.push(createBaseMarker({position:{lat:destination.lat(),lng:destination.lng()},map:gMap,title:t('map.return'),type:'retorno'}));
      }
    }
    gMap.addListener('click',()=>{if(_activeInfoWindow){_activeInfoWindow.close();_activeInfoWindow=null;}});
    const bnds=new google.maps.LatLngBounds();orderedGeo.forEach(c=>bnds.extend({lat:c.lat,lng:c.lng}));gMap.fitBounds(bnds,{top:40,bottom:40,left:40,right:40});google.maps.event.addListenerOnce(gMap,'idle',()=>{if(gMap.getZoom()>16)gMap.setZoom(16);if(gMap.getZoom()<10)gMap.setZoom(10);});if(orderedGeo.length===1)gMap.setZoom(15);
    // ETAs via Google Directions (precisos, com trânsito em tempo real v5.8.22)
    const legsDur=legs.map(l=>({duration:(l.duration_in_traffic||l.duration).value}));
    estimateTimesOSRM(legsDur);
    const urgCount=geocoded.filter(c=>clientDeadlineMin(c)<24*60).length;
    const urgMsg=urgCount?' ('+urgCount+' com janela de hor\xe1rio priorit\xe1ria)':'';
    renderC();updStats();
    saveHist();
    _perf.end=performance.now();
    console.log('[CALC-ROUTE] 6/6 Render+Save: '+Math.round(_perf.end-(_perf.dirEnd||_perf.optimize))+'ms');
    console.log('[CALC-ROUTE] === TOTAL: '+Math.round(_perf.end-_perf.start)+'ms ('+clients.length+' clientes) ===');
    console.log('[CALC-ROUTE] Breakdown: Ancora='+Math.round((_perf.anchor-_perf.start))+'ms | Geocode='+Math.round((_perf.geocode-_perf.anchor))+'ms | Base/Ret='+Math.round((_perf.baseRet-_perf.geocode))+'ms | OptV2='+Math.round((_perf.optimize-_perf.baseRet))+'ms | GDir='+Math.round(((_perf.dirEnd||_perf.optimize)-_perf.optimize))+'ms | Render='+Math.round((_perf.end-(_perf.dirEnd||_perf.optimize)))+'ms');
    // v4.8.5: Timing percebido (desde clique do botão até fim completo)
    if(_calcRouteClickTime>0){console.log('[PERF] TOTAL PERCEBIDO (clique→fim): '+Math.round(_perf.end-_calcRouteClickTime)+'ms');_calcRouteClickTime=0;}
    toast(t('t.optimized')+urgMsg,'ok');
  }catch(e){toast(t('e.calc')+': '+e.message,'err');console.error(e);}
  finally{g('rp').classList.remove('on');g('route-btn').disabled=!clients.length;}
}

function estimateTimesOSRM(legs){
  let cur=ts(cfg.saida||'10:00');
  const retS=ts(cfg.ret||'17:00'),tempo=(cfg.tempo||10)*60;
  const al1=cfg.al1,al2=cfg.al2;
  // legs[0]=base→cliente1, legs[1]=cliente1→cliente2, ..., legs[n]=ultimoCliente→retorno
  // Para N clientes geocodificados, temos N+1 legs (base + N clientes + retorno)
  const geocodedCount=order.filter(i=>clients[i].lat&&clients[i].lng).length;
  let legIdx=0;
  order.forEach((idx,stop)=>{
    const c=clients[idx];
    if(!c.lat||!c.lng){c.estT=null;return;} // Pula clientes sem coordenadas
    // Soma deslocamento: leg[legIdx] = trecho anterior até este cliente
    if(legIdx<legs.length)cur+=legs[legIdx].duration;
    legIdx++;
    cur+=_getEtaBufferSec(); // v5.8.28: buffer configurável por leg — propaga entre paradas (ex: saída C1 + viagem + buffer = chegada C2)
    // Verifica pausa de almoço
    if(al1&&al2){const s=ts(al1),e=ts(al2);if(cur>=s&&cur<e)cur=e;}
    c.estT=st2(cur);c.conflict=false;c.cmsg='';
    if(c.janela==='manha'&&cur>ts('12:00')){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', dispon\xEDvel at\xE9 12:00';}
    else if(c.janela==='tarde'&&cur<ts('12:00')){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', dispon\xEDvel ap\xF3s 12:00';}
    else if(c.janela==='custom'&&c.hi&&c.hf){
      if(cur<ts(c.hi)){const wm=Math.round((ts(c.hi)-cur)/60);c.conflict=true;c.cmsg='Chegada ~'+c.estT+', aguardar ~'+wm+'min (janela '+c.hi+')';cur=ts(c.hi);}// v5.8.41: snap
      else if(cur>ts(c.hf)){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', janela encerrada \xE0s '+c.hf;}
    }
    if(cur>retS){c.conflict=true;c.cmsg=(c.cmsg?c.cmsg+' / ':'')+'Al\xE9m do limite de retorno';}
    cur+=tempo; // Tempo de parada neste cliente
  });
}
function recalcDynamicETAs(){
  // Recalcula previsões a partir do horário real atual para paradas não concluídas
  const now=new Date();
  let cur=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
  const retS=ts(cfg.ret||'17:00'),tempo=(cfg.tempo||10)*60;
  const al1=cfg.al1,al2=cfg.al2;
  let first=true;
  order.forEach((idx)=>{
    const c=clients[idx];
    if(c._motDone){return;} // Pula concluídos
    if(!first){cur+=tempo;} // Tempo de deslocamento + parada (estimativa simples)
    first=false;
    cur+=_getEtaBufferSec(); // v5.8.28: buffer configurável por leg
    // Verifica pausa de almoço
    if(al1&&al2){const s=ts(al1),e=ts(al2);if(cur>=s&&cur<e)cur=e;}
    c.estT=st2(cur);c.conflict=false;c.cmsg='';
    if(c.janela==='manha'&&cur>ts('12:00')){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', dispon\xEDvel at\xE9 12:00';}
    else if(c.janela==='tarde'&&cur<ts('12:00')){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', dispon\xEDvel ap\xF3s 12:00';}
    else if(c.janela==='custom'&&c.hi&&c.hf){
      if(cur<ts(c.hi)){const wm=Math.round((ts(c.hi)-cur)/60);c.conflict=true;c.cmsg='Chegada ~'+c.estT+', aguardar ~'+wm+'min (janela '+c.hi+')';cur=ts(c.hi);}// v5.8.41: snap
      else if(cur>ts(c.hf)){c.conflict=true;c.cmsg='Chegada ~'+c.estT+', janela encerrada \xE0s '+c.hf;}
    }
    if(cur>retS){c.conflict=true;c.cmsg=(c.cmsg?c.cmsg+' / ':'')+'Al\xE9m do limite de retorno';}
    cur+=tempo; // Tempo de parada
  });
}
function estimateTimesSimple(){
  let cur=ts(cfg.saida||'10:00');
  const retS=ts(cfg.ret||'17:00'),tempo=(cfg.tempo||10)*60;
  const al1=cfg.al1,al2=cfg.al2;
  order.forEach((idx,stop)=>{
    const c=clients[idx];
    // Sem dados de rota real, estima tempo de parada para cada cliente seguinte
    if(stop>0)cur+=tempo;
    cur+=_getEtaBufferSec(); // v5.8.28: buffer configurável por leg
    if(al1&&al2){const s=ts(al1),e=ts(al2);if(cur>=s&&cur<e)cur=e;}
    c.estT=st2(cur);c.conflict=cur>retS;c.cmsg=c.conflict?'Al\xE9m do limite de retorno':'';
  });
}
function ts(t){const[h,m]=(t||'00:00').split(':').map(Number);return h*3600+m*60;}
function st2(s){const h=Math.floor(s/3600)%24,m=Math.floor((s%3600)/60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}
// v4.3.4: Formatar duração em minutos para "Xh Ymin" ou "X min"
function fmtDuration(min){if(min>=60){const h=Math.floor(min/60),m=min%60;return h+'h '+m+'min';}return min+' min';}
function resetMap(){if(leafRoute&&leafMap){leafMap.removeLayer(leafRoute);leafRoute=null;}if(leafMap)leafMap.eachLayer(l=>{if(l instanceof L.Marker)leafMap.removeLayer(l);});}

async function genImage(){
  if(!clients.length)return;
  const btn=g('pdf-btn');btn.disabled=true;btn.innerHTML='<span class="spin"></span> Gerando...';
  toast(t('msg.gen_image'),'');
  const col=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('coleta'));}),ent=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('entrega'));});
  const tapR=col.reduce((s,c)=>s+(c.qtd||0),0),tapE=ent.reduce((s,c)=>s+(c.qtd||0),0);
  const d=clients[0]?.data?new Date(clients[0].data+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}):new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  const wrap=document.createElement('div');
  wrap.style.cssText='width:520px;background:#F6F7FB;padding:16px;font-family:Figtree,Arial,sans-serif;position:fixed;top:-99999px;left:-99999px;z-index:-1';
  const cards=order.map((idx,stop)=>{
    const c=clients[idx];
    const tipos=normalizeTipo(c.tipo);const primaryTag=tipos[0]||'';const tagClr=_getTagColor(primaryTag)||'#6C5CE7';const tagLbl=_getTagLabel(primaryTag)||primaryTag;
    const vd=c.valTipo==='medir'?'Medir':c.valTipo==='pago'?'Pago':c.val?'R$ '+fmtBRL(c.val):'';
    const det=[c.tel?c.tel:'',c.qtd?c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':''):'',vd].filter(Boolean).join(' · ');
    return `<div style="background:#fff;border:1px solid #E2E4F0;border-left:3.5px solid ${tagClr};border-radius:8px;padding:11px 12px;margin-bottom:7px;display:flex;gap:10px;align-items:flex-start">
      <div style="width:20px;height:20px;min-width:20px;border-radius:50%;background:${tagClr}22;color:${tagClr};font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:2px">${stop+1}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <span style="font-weight:600;font-size:13px;color:#1C1F3B;line-height:1.4">${c.nome}</span>
          <span style="font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:2px 8px;border-radius:20px;background:${tagClr}22;color:${tagClr};white-space:nowrap;margin-top:2px">${tagLbl}</span>
        </div>
        ${c.endereco?`<div style="font-size:12px;color:#6B6F8E;margin-top:3px">${c.endereco}${c.complemento?' — '+c.complemento:''}</div>`:''}
        ${det?`<div style="font-size:12px;color:#6B6F8E;margin-top:5px">${det}</div>`:''}
        ${c.obs?`<div style="font-size:11px;color:#6B6F8E;margin-top:3px;font-style:italic">${c.obs}</div>`:''}
        ${c.conflict?`<div style="font-size:11px;color:#E2445C;margin-top:3px;font-weight:600">${c.cmsg}</div>`:''}
      </div>
    </div>`;
  }).join('');
  wrap.innerHTML=`
    <div style="background:#1C1F3B;border-radius:12px;padding:16px;margin-bottom:12px;text-align:center">
      <div style="color:#fff;font-weight:700;font-size:16px">Roteiro</div>
      <div style="color:#A0A5C8;font-size:12px;margin-top:4px">${d.charAt(0).toUpperCase()+d.slice(1)}</div>
      <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;justify-content:center">
        <span style="background:rgba(0,200,117,.15);color:#00C875;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">${col.length} ${_getTagLabel('coleta')||'coleta'}${col.length!==1?'s':''} · ${tapR} ite${tapR!==1?'ns':'m'} a retirar</span>
        <span style="background:rgba(0,152,247,.15);color:#4DB8FF;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">${ent.length} ${_getTagLabel('entrega')||'entrega'}${ent.length!==1?'s':''} · ${tapE} ite${tapE!==1?'ns':'m'} a entregar</span>
      </div>
    </div>
    ${cards}
    <div style="text-align:center;font-size:10px;color:#A0A5C8;margin-top:8px">Sa\xedda ${cfg.saida||'10:00'} \u00B7 Retorno ${cfg.ret||'17:00'} \u00B7 ${cfg.tempo||10} min/parada \u00B7 Gerado em ${new Date().toLocaleString('pt-BR')}</div>`;
  document.body.appendChild(wrap);
  try{
    const canvas=await html2canvas(wrap,{scale:2,useCORS:true,backgroundColor:'#F6F7FB',logging:false});
    const link=document.createElement('a');
    link.download='roteiro-'+new Date().toISOString().split('T')[0]+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
    toast(t('t.imggen'),'ok');
    saveHist();
  }catch(e){toast(t('err.gen_image')+': '+e.message,'err');console.error(e);}
  finally{
    try{document.body.removeChild(wrap);}catch(e){}
    const btn=g('pdf-btn');if(btn){btn.disabled=false;btn.innerHTML='<span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span> Gerar imagem do roteiro';}
  }
}

function genPDF_unused(){
  if(!clients.length)return;
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'a4'});
  const W=210,M=14,CW=W-M*2;let y=14;
  // Header
  doc.setFillColor(28,31,59);doc.rect(0,0,W,28,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(14);doc.setFont('helvetica','bold');
  doc.text('Roteiro de Coleta',M,16);
  const d=clients[0]?.data?new Date(clients[0].data+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}):new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(160,165,200);
  doc.text(d.charAt(0).toUpperCase()+d.slice(1),W-M,16,{align:'right'});
  y=36;
  // Summary bar
  const col=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('coleta'));}),ent=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('entrega'));});
  const tapR=col.reduce((s,c)=>s+(c.qtd||0),0),tapE=ent.reduce((s,c)=>s+(c.qtd||0),0);
  doc.setFillColor(246,247,251);doc.setDrawColor(226,228,240);doc.rect(M,y,CW,10,'FD');
  doc.setFontSize(8);doc.setFont('helvetica','normal');doc.setTextColor(107,111,142);
  doc.text(clients.length+' clientes   \u2022   '+col.length+' coleta'+(col.length!==1?'s':'')+' / '+ent.length+' entrega'+(ent.length!==1?'s':'')+'   \u2022   Retirar: '+tapR+' ite'+(tapR!==1?'ns':'m')+'   \u2022   Entregar: '+tapE+' ite'+(tapE!==1?'ns':'m'),M+4,y+7);
  y+=15;
  const cfls=clients.filter(c=>c.conflict);
  if(cfls.length){doc.setFillColor(254,232,235);doc.setDrawColor(226,68,92);doc.rect(M,y,CW,9,'FD');doc.setFontSize(8);doc.setTextColor(155,27,46);doc.setFont('helvetica','bold');doc.text('\u26A0  ATENCAO: '+cfls.length+' conflito(s) de horario detectado(s)',M+3,y+6.5);y+=13;}
  order.forEach((idx,stop)=>{
    const c=clients[idx];
    if(y>258){doc.addPage();y=14;}
    const endCompl=(c.endereco||'')+(c.complemento?' — '+c.complemento:'');
    const lines=doc.splitTextToSize(endCompl,CW-30);
    const hasExtra=c.tel||c.qtd||c.val||c.valTipo!=='normal'&&c.valTipo||c.estT;
    const h=10+(lines.length*4.5)+(hasExtra?5:0)+(c.obs?5:0)+(c.conflict?5:0)+4;
    // Card background
    const tipos=normalizeTipo(c.tipo);const isCol=tipos.includes(_resolveTagId('coleta'));
    doc.setFillColor(isCol?230:230,isCol?251:245,isCol?243:255);
    doc.setDrawColor(isCol?200:200,isCol?235:230,isCol?220:245);
    doc.rect(M,y,CW,h,'FD');
    // Left accent bar
    doc.setFillColor(isCol?0:0,isCol?200:152,isCol?117:247);
    doc.rect(M,y,2.5,h,'F');
    // Stop number
    doc.setFillColor(isCol?0:0,isCol?200:152,isCol?117:247);
    doc.circle(M+10,y+6.5,4,'F');
    doc.setTextColor(255,255,255);doc.setFontSize(7.5);doc.setFont('helvetica','bold');
    doc.text(String(stop+1),M+10,y+8.5,{align:'center'});
    // Name
    doc.setTextColor(28,31,59);doc.setFontSize(10);doc.setFont('helvetica','bold');
    doc.text(c.nome,M+17,y+8);
    // Type badge
    const tl=isCol?'COLETA':'ENTREGA';
    doc.setFontSize(6.5);doc.setTextColor(isCol?0:0,isCol?166:98,isCol?94:200);
    doc.setFont('helvetica','bold');doc.text(tl,W-M-4,y+8,{align:'right'});
    // Address
    let ry=y+14;
    if(c.endereco){doc.setFontSize(8.5);doc.setFont('helvetica','normal');doc.setTextColor(80,84,110);doc.text(lines,M+17,ry);ry+=lines.length*4.5;}
    // Details row
    const parts=[];
    if(c.tel)parts.push('Tel: '+c.tel);
    if(c.qtd)parts.push(c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':''));
    const vLabel=c.valTipo==='medir'?'Medir':c.valTipo==='pago'?'Pago':c.val?'R$ '+fmtBRL(c.val):'';
    if(vLabel)parts.push(vLabel);
    if(c.estT)parts.push('~'+c.estT);
    if(parts.length){doc.setFontSize(8);doc.setTextColor(107,111,142);doc.text(parts.join('   \u2022   '),M+17,ry);ry+=5;}
    if(c.obs){doc.setFontSize(7.5);doc.setTextColor(130,135,160);doc.setFont('helvetica','italic');doc.text('Obs: '+c.obs.slice(0,90),M+17,ry);}
    if(c.conflict){doc.setFontSize(7.5);doc.setTextColor(155,27,46);doc.setFont('helvetica','bold');doc.text('\u26A0 '+c.cmsg,M+17,ry);}
    y+=h+4;
  });
  // Maps link
  if(cfg.gkey&&clients.length>1){
    if(y>260){doc.addPage();y=14;}
    const addrs=order.map(i=>encodeURIComponent(clients[i].endereco));
    const orig=cfg.base?encodeURIComponent(cfg.base):addrs[0];
    const dest=cfg.retaddr?encodeURIComponent(cfg.retaddr):(cfg.base?encodeURIComponent(cfg.base):addrs[addrs.length-1]);
    const url='https://www.google.com/maps/dir/'+orig+'/'+addrs.join('/')+'/'+dest;
    doc.setFillColor(240,238,255);doc.setDrawColor(196,181,253);doc.rect(M,y,CW,14,'FD');
    doc.setFontSize(7.5);doc.setFont('helvetica','bold');doc.setTextColor(86,73,192);doc.text('Rota no Google Maps:',M+3,y+6);
    doc.setFont('helvetica','normal');doc.setTextColor(108,92,231);doc.textWithLink(url.slice(0,95)+(url.length>95?'...':''),M+3,y+11,{url});
    y+=18;
  }
  // Footer
  doc.setFontSize(7.5);doc.setFont('helvetica','normal');doc.setTextColor(160,165,200);
  doc.text('Saida: '+(cfg.saida||'10:00')+'  |  Retorno: '+(cfg.ret||'17:00')+'  |  '+(cfg.tempo||10)+' min/parada'+(cfg.base?'  |  Partida: '+cfg.base:''),M,293);
  doc.text('Gerado em '+new Date().toLocaleString('pt-BR'),W-M,293,{align:'right'});
  doc.save('roteiro-'+new Date().toISOString().split('T')[0]+'.pdf');
  saveHist();toast(t('t.pdf_generated'),'ok');
}

function getHist(){return safeJsonParse('rota_hist',[]);}
function saveHist(){
  const hist=getHist();const today=new Date().toISOString().split('T')[0];
  const entry={date:today,savedAt:new Date().toISOString(),clients:JSON.parse(JSON.stringify(clients)),order:[...order]};
  const i=hist.findIndex(h=>h.date===today);
  if(i>=0)hist[i]=entry;else hist.unshift(entry);
  localStorage.setItem('rota_hist',JSON.stringify(hist.slice(0,90)));
  _syncPushDebounced();
  // Auto-publish to cloud if route has been published
  if(_currentRouteId)cloudPublish();
}
function renderHist(){
  const hist=getHist();const el=g('hlist');
  if(!hist.length){el.innerHTML='<div class="empty"><span class="mot-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span><p>'+t('hist.empty')+'</p></div>';return;}

// ════════════════════════════════════════════════════════════
// SECTION: HISTORY
// ════════════════════════════════════════════════════════════

  // v4.5.0: Date filter for history list
  const filterEl=document.getElementById('hist-date-filter');
  el.innerHTML='<div class="hist-filters" style="margin-bottom:14px"><input type="text" id="hist-search" placeholder="'+t('hist.search_ph')+'" oninput="filterHistList(this.value)"></div>';
  el.innerHTML+=hist.map((h,i)=>{
    const d=new Date(h.date+'T12:00').toLocaleDateString(_lang==='en'?'en-US':'pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    const col=h.clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('coleta'));}).length,ent=h.clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('entrega'));}).length;
    const clientNames=h.clients.map(c=>(c.nome||'').toLowerCase()).join('|');
    const clientTels=h.clients.map(c=>(c.tel||'')).join('|');
    // v5.8.38: BUG-02 — usar stats.coletas/entregas (com {n}) em vez de misc (estático)
    return '<div class="hi" onclick="openHist('+i+')" data-clients="'+clientNames.replace(/"/g,'&quot;')+'" data-tels="'+clientTels.replace(/"/g,'&quot;')+'"><div style="width:42px;height:42px;background:var(--pul);border-radius:var(--rl2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0"><span class="mot-ico" style="width:20px;height:20px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span></div><div><div style="font-weight:700;font-size:14px">'+d.charAt(0).toUpperCase()+d.slice(1)+'</div><div class="hm">'+h.clients.length+' '+t('hist.clients')+' · '+t(col===1?'stats.coleta':'stats.coletas',{n:col})+' / '+t(ent===1?'stats.entrega':'stats.entregas',{n:ent})+'</div></div></div>';
  }).join('');
}
// v4.6.2: Filter history list by date, client name, or phone
function filterHistList(query){
  const q=query.toLowerCase().trim();
  const qDigits=q.replace(/\D/g,'');
  document.querySelectorAll('#hlist .hi').forEach(item=>{
    const text=item.textContent.toLowerCase();
    const clientNames=item.dataset.clients||'';
    const clientTels=(item.dataset.tels||'').replace(/\D/g,'');
    const match=!q||text.includes(q)||clientNames.includes(q)||(qDigits.length>=3&&clientTels.includes(qDigits));
    item.style.display=match?'':'none';
  });
}
function openHist(i){
  histIdx=i;const h=getHist()[i];
  const d=new Date(h.date+'T12:00').toLocaleDateString(_lang==='en'?'en-US':'pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  g('hm-title').textContent=d.charAt(0).toUpperCase()+d.slice(1);
  const col=h.clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('coleta'));}),ent=h.clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('entrega'));});
  let html='<div class="ab ok">'+h.clients.length+' '+t('hist.clients')+' — '+t('misc.coletas',{n:col.length})+' / '+t('misc.entregas',{n:ent.length})+'</div>';
  // Gráficos donut no histórico (se houver dados de status/pagamento)
  const hasMotorData=h.order.some(idx=>{const c=h.clients[idx]||h.clients[0];return c&&(c._motStatus||c._motPay);});
  if(hasMotorData)html+=buildChartsHTML(h.clients,h.order);
  // v4.5.0: History filters
  html+='<div class="hist-filters">'
    +'<input type="text" placeholder="'+t('hist.search_client')+'" oninput="filterHistCards(this.value)">'
    +'<select onchange="filterHistType(this.value)"><option value="">'+t('hist.all')+'</option><option value="coleta">'+t('mot.coleta')+'</option><option value="entrega">'+t('mot.entrega')+'</option></select>'
  +'</div>';
  html+='<div id="hist-card-list">';
  h.order.forEach((idx,stop)=>{const c=h.clients[idx]||h.clients[stop];if(!c)return;const tipos=normalizeTipo(c.tipo);const primaryColor=tipos.length?_getTagColor(tipos[0]):'rgba(108,92,231,.18)';const tagChips=renderTagChips(tipos);const bw=tagBorderWidth(tipos);const borderStyle=tipos.length<=1?'border-left:3px solid '+primaryColor:'border-left:none;padding-left:'+(13+bw)+'px;overflow:hidden;position:relative';const vd=c.valTipo==='medir'?'Medir':c.valTipo==='pago'?'Pago':c.val?'R$ '+fmtBRL(c.val):'';html+='<div class="hist-card" data-hc-name="'+(c.nome||'').toLowerCase()+'" data-hc-type="'+(tipos.join(','))+'" style="'+borderStyle+'">'+(tipos.length>1?renderTagBorder(tipos):'')+'<div class="hc-num" style="background:'+primaryColor+'">'+(stop+1)+'</div><div class="hc-info"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px"><span class="hc-name">'+c.nome+'</span>'+(tagChips?'<div style="display:flex;gap:3px;flex-wrap:wrap;flex-shrink:0">'+tagChips+'</div>':'')+'</div><div class="hc-addr">'+c.endereco+(c.complemento&&!c.endereco.includes(c.complemento)?' \u2014 '+c.complemento:'')+'</div><div class="hc-meta">'/* v5.5.2: fix 8 */+(c.tel?'<span>\u260E '+c.tel+'</span>':'')+(c.qtd?'<span>'+c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':'')+'</span>':'')+(vd?'<span>'+vd+'</span>':'')+'</div>'
// v4.7.2: Show motorist data (status, payment, obs) in history cards
+(c._motStatus||c._motPay||c._motObs?'<div class="hc-motor" style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;align-items:center">'
+(c._motStatus?'<span style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px;background:'+(c._motStatus==='ausente'||c._motStatus==='reagendar'?'var(--rl)':'var(--gnl)')+';color:'+(c._motStatus==='ausente'||c._motStatus==='reagendar'?'var(--rd)':'var(--gnd)')+'">'+({coletado:t('mot.status_coletado'),entregue:t('mot.status_entregue'),ausente:t('mot.status_ausente'),reagendar:t('mot.status_reagendar')}[c._motStatus]||c._motStatus)+'</span>':'')
+(c._motPay?'<span style="font-size:11px;padding:2px 8px;border-radius:6px;background:var(--pul);color:var(--pu)">'+c._motPay+'</span>':'')
+(c._motObs?'<div style="font-size:11px;color:var(--mu);margin-top:4px;width:100%;font-style:italic">\u201C'+esc(c._motObs)+'\u201D</div>':'')
+'</div>':'')
+'</div></div>';});
  html+='</div>';
  g('hm-body').innerHTML=html;g('hist-modal').classList.add('on');
  history.pushState({modal:'hist-modal'},'',null);/* v5.5.2: fix 9 — back button fecha modal */
}
// v4.5.0: History card filters
function filterHistCards(query){
  const q=query.toLowerCase().trim();
  document.querySelectorAll('#hist-card-list .hist-card').forEach(card=>{
    const name=card.dataset.hcName||'';
    card.style.display=(!q||name.includes(q))?'':'none';
  });
}
function filterHistType(tipo){
  document.querySelectorAll('#hist-card-list .hist-card').forEach(card=>{
    const types=card.dataset.hcType||'';
    card.style.display=(!tipo||types.includes(tipo))?'':'none';
  });
}

function loadHist(){
  if(clients.length>0){
    showConfirm(t('confirm.replace_title'),t('confirm.replace_msg',{n:clients.length}),()=>{doLoadHist();});
    return;
  }
  doLoadHist();
}
function doLoadHist(){window.scrollTo(0,0);
  const h=getHist()[histIdx];clients=JSON.parse(JSON.stringify(h.clients));order=[...h.order];
  closeModal('hist-modal');
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.ntab').forEach(x=>x.classList.remove('on'));
  g('page-rota').classList.add('on');document.querySelectorAll('.ntab')[0].classList.add('on');
  renderC();updStats();updBtns();toast(t('t.route_loaded'),'ok');
}
function delHist(){
  showConfirm(t('confirm.delete_hist_title'),t('confirm.delete_hist_msg'),()=>{
    const hist=getHist();hist.splice(histIdx,1);localStorage.setItem('rota_hist',JSON.stringify(hist));
    closeModal('hist-modal');renderHist();toast(t('t.route_removed'),'');
  });
}


// v4.3.9: Pre-load bairros data in background
let _dashCache={br:null,pts:null,loading:false,loaded:false};
async function preloadDashData(){
  if(_dashCache.loaded||_dashCache.loading)return;
  _dashCache.loading=true;
  const hist=getHist();const allC=hist.flatMap(h=>h.clients);
  if(!allC.length){_dashCache.loading=false;return;}
  const br={};const pts=[];
  for(const c of allC){
    try{
      const r=await nominatim(c.endereco);
      if(r){
        pts.push([r.lat,r.lng]);
        const rev=await nominatimReverse(r.lat,r.lng);
        const addr=rev.address||{};
        const bairro=(addr.suburb||addr.neighbourhood||addr.quarter||addr.city_district||'').trim();
        if(bairro){
          br[bairro]=(br[bairro]||0)+1;
          if(!_bairroCoords)_bairroCoords={};
          if(!_bairroCoords[bairro])_bairroCoords[bairro]={lats:[],lngs:[]};
          _bairroCoords[bairro].lats.push(r.lat);
          _bairroCoords[bairro].lngs.push(r.lng);
        }
      }
      await new Promise(res=>setTimeout(res,300));
    }catch(e){}
  }
  _dashCache.br=br;_dashCache.pts=pts;_dashCache.loaded=true;_dashCache.loading=false;
}
async function renderDash(){
  const hist=getHist();const allC=hist.flatMap(h=>h.clients);
  const topBar=g('dash-top-bar');const drawer=g('dash-drawer');const drawerToggle=g('dash-drawer-toggle');
  if(!allC.length){
    g('hmph').style.display='flex';g('heatmap').style.display='none';
    if(topBar)topBar.style.display='none';if(drawer)drawer.style.display='none';if(drawerToggle)drawerToggle.style.display='none';
    return;
  }
  g('hmph').style.display='none';g('heatmap').style.display='block';
  if(topBar)topBar.style.display='flex';
  if(drawerToggle)drawerToggle.style.display='flex';
  if(drawer){drawer.style.display='flex';drawer.classList.remove('closed');
    /* v4.7.6: Start collapsed on mobile */
    if(window.innerWidth<=480){drawer.classList.add('collapsed');drawer.style.overflowY='hidden';}
    else{drawer.classList.remove('collapsed');drawer.style.overflowY='';}
    if(drawerToggle)drawerToggle.classList.add('open');
  }
  const totalClientes=allC.length;const totalRotas=hist.length;
  const sumEl=g('dash-summary');
  if(sumEl)sumEl.textContent=totalClientes+' '+t('hist.clients')+' \xB7 '+totalRotas+' '+(totalRotas===1?t('dash.rota'):t('dash.rotas'));
  // v4.6.0: Use cached data if available
  if(_dashCache.loaded){
    renderDashStats(_dashCache.br,_dashCache.pts);
    return;
  }
  const _pBody=g('dash-panel-body');if(_pBody)_pBody.innerHTML='<div style="padding:8px 0;text-align:center;font-size:12px;color:var(--mu)">'+t('dash.identifying')+' <span class="spin"></span></div>';
  const _dashT=setTimeout(()=>{const b=g('dash-panel-body');if(b&&b.innerHTML.includes(t('dash.identifying')))b.innerHTML='<p style="font-size:12px;color:var(--mu);padding:8px 0">'+t('dash.no_bairros')+'</p>';},15000);
  const br={};const pts=[];
  // Nominatim: sequential to respect rate limit
  for(const c of allC){
    try{
      const r=await nominatim(c.endereco);
      if(r){
        pts.push([r.lat,r.lng]);
        // Reverse geocode to get suburb/neighborhood
        const rev=await nominatimReverse(r.lat,r.lng);
        const addr=rev.address||{};
        const bairro=(addr.suburb||addr.neighbourhood||addr.quarter||addr.city_district||'').trim();
        if(bairro){
          br[bairro]=(br[bairro]||0)+1;
          if(!_bairroCoords)_bairroCoords={};
          if(!_bairroCoords[bairro])_bairroCoords[bairro]={lats:[],lngs:[]};
          _bairroCoords[bairro].lats.push(r.lat);
          _bairroCoords[bairro].lngs.push(r.lng);
        }
      }
      await new Promise(res=>setTimeout(res,300));// rate limit
    }catch(e){}
  }
  renderDashStats(br,pts);
}
// v4.6.0: Toggle drawer lateral
function toggleDashDrawer(){
  const drawer=g('dash-drawer');const toggle=g('dash-drawer-toggle');
  if(!drawer)return;
  const isOpen=!drawer.classList.contains('closed');
  if(isOpen){
    drawer.classList.add('closed');if(toggle)toggle.classList.remove('open');
  } else {
    drawer.classList.remove('closed');if(toggle)toggle.classList.add('open');
  }
}
/* v4.7.6: Bottom sheet toggle for mobile */
function toggleDashSheet(){
  const drawer=g('dash-drawer');if(!drawer)return;
  const isMobile=window.innerWidth<=480;
  if(!isMobile){toggleDashDrawer();return;}
  if(drawer.classList.contains('collapsed')){
    drawer.classList.remove('collapsed');
    drawer.style.overflowY='auto';
  } else {
    drawer.classList.add('collapsed');
    drawer.style.overflowY='hidden';
  }
}
/* v4.7.6: Touch drag for bottom sheet */
(function(){
  let _sheetY0=0,_sheetDragging=false,_sheetStartTransform=0;
  function getDrawer(){return document.getElementById('dash-drawer');}
  function isMobile(){return window.innerWidth<=480;}
  document.addEventListener('touchstart',function(e){
    if(!isMobile())return;
    const handle=e.target.closest('.dash-sheet-handle');
    if(!handle)return;
    const drawer=getDrawer();if(!drawer)return;
    _sheetDragging=true;
    _sheetY0=e.touches[0].clientY;
    const st=getComputedStyle(drawer);
    const mat=new DOMMatrix(st.transform);
    _sheetStartTransform=mat.m42||0;
    drawer.style.transition='none';
  },{passive:true});
  document.addEventListener('touchmove',function(e){
    if(!_sheetDragging)return;
    const dy=e.touches[0].clientY-_sheetY0;
    const drawer=getDrawer();if(!drawer)return;
    const newY=Math.max(0,_sheetStartTransform+dy);
    drawer.style.transform='translateY('+newY+'px)';
  },{passive:true});
  document.addEventListener('touchend',function(){
    if(!_sheetDragging)return;
    _sheetDragging=false;
    const drawer=getDrawer();if(!drawer)return;
    drawer.style.transition='';
    const st=getComputedStyle(drawer);
    const mat=new DOMMatrix(st.transform);
    const curY=mat.m42||0;
    const h=drawer.offsetHeight;
    if(curY>h*0.4){
      drawer.classList.add('collapsed');
      drawer.style.overflowY='hidden';
    } else {
      drawer.classList.remove('collapsed');
      drawer.style.overflowY='auto';
    }
    drawer.style.transform='';
  },{passive:true});
})();
// v4.6.0: Set heatmap mode from top bar buttons
function setHeatmapMode(mode){
  _heatmapMode=mode;
  document.querySelectorAll('.hm-mode-opt').forEach(el=>{
    el.classList.toggle('active',el.dataset.mode===_heatmapMode);
  });
  rerenderHeatmap();
}
// v4.4.1: Store bairro coordinates for hover highlight
let _bairroCoords={};
function renderDashStats(br,pts){
  const el=g('dash-panel-body');if(!el)return;
  const sorted=Object.entries(br).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const sumEl2=g('dash-summary');
  if(sumEl2){const cur=sumEl2.textContent;if(!cur.includes(t('dash.bairro'))&&!cur.includes(t('dash.bairros')))sumEl2.textContent=cur+' \xb7 '+sorted.length+' '+(sorted.length===1?t('dash.bairro'):t('dash.bairros'));}
  _bairroCoords={};
  if(pts.length&&typeof _dashCache!=='undefined'&&_dashCache.br){
  }
  // v4.6.0: Premium bairro list — clean, minimal, no bars
  el.innerHTML=sorted.length?sorted.map(([b,n],i)=>
    '<div class="dash-bairro-item" onmouseenter="highlightBairroByName(\''+b.replace(/'/g,"\\'")+'\',this)" onmouseleave="clearBairroHighlight()">'
    +'<div class="dash-bairro-rank">'+(i+1)+'</div>'
    +'<div class="dash-bairro-name">'+b+'</div>'
    +'<div class="dash-bairro-count">'+n+'</div>'
    +'</div>'
  ).join(''):'<p style="font-size:12px;color:var(--mu);padding:4px 0">Nenhum bairro identificado.</p>';
  if(!pts.length)return;
  /* v5.5.2: fix 6 — Maps API pode não ter carregado ainda no mobile; retry */
  if(!window.google?.maps){
    let _mapsRetry=0;
    const _waitMaps=setInterval(()=>{
      if(window.google?.maps){clearInterval(_waitMaps);renderDashStats(br,pts);}
      else if(++_mapsRetry>20){clearInterval(_waitMaps);}
    },300);
    return;
  }
  if(!hmMap){hmMap=new google.maps.Map(document.getElementById('heatmap'),{center:{lat:-23.55,lng:-46.63},zoom:11,mapId:GMAP_ID,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,zoomControl:false,rotateControl:false,scaleControl:false,keyboardShortcuts:false,gestureHandling:'greedy'});}
  if(hmHeatLayer)hmHeatLayer.setMap(null);
  hmHeatLayer=_makeHeatmap({data:pts.map(pt=>new google.maps.LatLng(pt[0],pt[1])),radius:35,map:hmMap}); // v5.8.40: canvas heatmap
  const hmBnds=new google.maps.LatLngBounds();pts.forEach(pt=>hmBnds.extend({lat:pt[0],lng:pt[1]}));hmMap.fitBounds(hmBnds);
  // v4.4.0: Enforce minimum zoom level to prevent extreme zoom out
  google.maps.event.addListenerOnce(hmMap,'idle',()=>{if(hmMap.getZoom()>15)hmMap.setZoom(15);if(hmMap.getZoom()<10)hmMap.setZoom(10);});
  renderGeoDash(pts);
  // v4.6.1: Day grouping removido
}
// v4.3.9: Dashboard geográfico — zonas, cobertura, densidade
const ZONE_COLORS={Norte:'#6366F1',Sul:'#EC4899',Leste:'#F59E0B',Oeste:'#10B981',Centro:'#8B5CF6'};
const ZONE_NAMES={Norte:'zone.north',Sul:'zone.south',Leste:'zone.east',Oeste:'zone.west',Centro:'zone.center'};
function classifyZone(lat,lng){
  // Centro de SP como referência
  const cLat=-23.5505,cLng=-46.6333;
  const dLat=lat-cLat,dLng=lng-cLng;
  const dist=Math.sqrt(dLat*dLat+dLng*dLng);
  if(dist<0.02)return 'Centro';
  // Ângulo em graus
  const angle=Math.atan2(dLat,dLng)*180/Math.PI;
  if(angle>=45&&angle<135)return 'Norte';
  if(angle>=-135&&angle<-45)return 'Sul';
  if(angle>=-45&&angle<45)return 'Leste';
  return 'Oeste';
}
function haversine(lat1,lng1,lat2,lng2){
  const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function renderGeoDash(pts){
  const zoneCard=g('geo-zone-card');
  if(!pts||pts.length<2){if(zoneCard)zoneCard.style.display='none';return;}
  if(zoneCard)zoneCard.style.display='block';
  // Classificar zonas
  const zones={Norte:0,Sul:0,Leste:0,Oeste:0,Centro:0};
  const cLat=-23.5505,cLng=-46.6333;
  let baseLat=cLat,baseLng=cLng;
  if(_geoAnchor){baseLat=_geoAnchor.lat;baseLng=_geoAnchor.lng;}
  const dists=[];
  pts.forEach(pt=>{
    const z=classifyZone(pt[0],pt[1]);
    zones[z]++;
    dists.push(haversine(baseLat,baseLng,pt[0],pt[1]));
  });
  const total=pts.length;
  // v4.6.0: Donut SVG — compact horizontal layout
  const donutEl=g('zone-donut');const legEl=g('zone-legend');
  if(donutEl&&legEl){
    let cumul=0;let paths='';let legHtml='';
    const entries=Object.entries(zones).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
    entries.forEach(([zone,count])=>{
      const pct=count/total;
      const startAngle=cumul*360;
      const endAngle=(cumul+pct)*360;
      paths+=donutArc(18,18,14,startAngle,endAngle,ZONE_COLORS[zone]);
      legHtml+='<div class="zone-legend-item"><div class="zone-legend-dot" style="background:'+ZONE_COLORS[zone]+'"></div>'+t(ZONE_NAMES[zone])+'<span class="zone-legend-count">'+count+'</span></div>';
      cumul+=pct;
    });
    donutEl.innerHTML=paths+'<circle cx="18" cy="18" r="9.5" fill="var(--bg)"/><text x="18" y="17" text-anchor="middle" dominant-baseline="central" style="font-size:6px;font-weight:800;fill:var(--tx)">'+total+'</text><text x="18" y="20.5" text-anchor="middle" dominant-baseline="central" style="font-size:2.2px;font-weight:600;fill:var(--mu);text-transform:uppercase;letter-spacing:.04em">clientes</text>';
    legEl.innerHTML=legHtml;
  }
  // v4.6.2: Card Cobertura removido — stats calculation removido
}
function donutArc(cx,cy,r,startDeg,endDeg,color){
  if(endDeg-startDeg>=359.99)return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="4"/>';
  const s=startDeg-90,e=endDeg-90;
  const sr=s*Math.PI/180,er=e*Math.PI/180;
  const x1=cx+r*Math.cos(sr),y1=cy+r*Math.sin(sr);
  const x2=cx+r*Math.cos(er),y2=cy+r*Math.sin(er);
  const large=(endDeg-startDeg)>180?1:0;
  return '<path d="M'+x1+' '+y1+' A'+r+' '+r+' 0 '+large+' 1 '+x2+' '+y2+'" fill="none" stroke="'+color+'" stroke-width="4" stroke-linecap="round"/>';
}


// ── SVG Icons (monocromáticos, traço fino) ──
const MI={
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  nav:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  dollar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  // v4.7.4: Novos ícones para substituir emojis (M1 Monochrome)
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>'
};
function mi(name,cls){return '<span class="mot-ico'+(cls?' '+cls:'')+'">'+MI[name]+'</span>';}

function getMotoristaLink(){
  const base=window.location.origin+window.location.pathname;
  let link=base+'?modo=motorista';
  if(_currentRouteId)link+='&rota='+_currentRouteId;
  return link;
}
function copyMotLink(){
  if(!_currentRouteId){
    toast(t('msg.publish_first'),'err');return;
  }
  const link=getMotoristaLink();
  navigator.clipboard.writeText(link).then(()=>{
    toast(t('msg.link_copied'),'ok');
  }).catch(()=>{
    const ta=document.createElement('textarea');ta.value=link;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    toast(t('msg.link_copied'),'ok');
  });
}
function shareMotWhatsApp(){
  if(!_currentRouteId){
    toast(t('msg.publish_first'),'err');return;
  }
  const link=getMotoristaLink();
  const text='Acesse o roteiro do dia aqui:\n'+link;
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
}
// v4.3.2: QR Code generator (lightweight, no external dependency)
// v4.3.2: Banner de notificação de atualização pro motorista
function showUpdateBanner(msg){
  const banner=g('mot-update-banner');
  if(!banner)return;
  g('mot-update-msg').textContent=msg;
  banner.classList.add('show');
  // Auto-dismiss após 8 segundos
  clearTimeout(window._updateBannerT);
  window._updateBannerT=setTimeout(dismissUpdateBanner,8000);
  // Vibrar se suportado
  if(navigator.vibrate)navigator.vibrate([100,50,100]);
}
function dismissUpdateBanner(){
  const banner=g('mot-update-banner');
  if(banner)banner.classList.remove('show');
}

function showMotQR(){
  if(!_currentRouteId){toast(t('msg.publish_first'),'err');return;}
  const link=getMotoristaLink();
  const box=g('mot-qr-box');box.style.display='block';
  // Carregar lib QR leve via CDN se não disponível
  if(!window.QRCode){
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload=()=>_renderQR(link);
    document.head.appendChild(s);
  }else{_renderQR(link);}
}
function _renderQR(text){
  const container=g('mot-qr-canvas');
  container.innerHTML='';
  new QRCode(container,{text,width:180,height:180,colorDark:'#1e1b4b',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
}
function buildDonutSVG(segments,centerText,centerSub){
  // segments: [{value,color,label}]
  const total=segments.reduce((s,seg)=>s+seg.value,0);
  if(!total)return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--bd)" stroke-width="8" opacity=".3"/><text x="50" y="48" text-anchor="middle" class="mot-chart-center" style="font-size:13px">0</text><text x="50" y="58" text-anchor="middle" class="mot-chart-center-sub">'+centerSub+'</text></svg>';
  const R=40,C=2*Math.PI*R;
  let offset=0;
  let arcs='';
  segments.forEach(seg=>{
    if(seg.value<=0)return;
    const pct=seg.value/total;
    const dash=pct*C;
    const gap=C-dash;
    arcs+='<circle cx="50" cy="50" r="'+R+'" fill="none" stroke="'+seg.color+'" stroke-width="8" stroke-dasharray="'+dash.toFixed(2)+' '+gap.toFixed(2)+'" stroke-dashoffset="'+(-offset).toFixed(2)+'" transform="rotate(-90 50 50)" stroke-linecap="round" style="transition:all .4s ease"/>';
    offset+=dash;
  });
  return '<svg viewBox="0 0 100 100">'+arcs+'<text x="50" y="48" text-anchor="middle" class="mot-chart-center">'+centerText+'</text><text x="50" y="59" text-anchor="middle" class="mot-chart-center-sub">'+centerSub+'</text></svg>';
}
function buildDonutLegend(segments){
  return '<div class="mot-chart-legend">'+segments.filter(s=>s.value>0).map(s=>'<span style="--dot-color:'+s.color+'"><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:'+s.color+';flex-shrink:0"></span>'+s.label+' ('+s.value+')</span>').join('')+'</div>';
}
function buildChartsHTML(clientsList,orderList){
  const total=orderList.length;if(!total)return '';
  // v4.9.2: null-safety — evita crash se índice inválido no order
  const _gc=i=>{const c=clientsList[i];return c||null;};
  // 1) Status
  const done=orderList.filter(i=>{const c=_gc(i);return c&&(c._motStatus==='coletado'||c._motStatus==='entregue');}).length;
  const ausente=orderList.filter(i=>{const c=_gc(i);return c&&c._motStatus==='ausente';}).length;
  const reagendar=orderList.filter(i=>{const c=_gc(i);return c&&c._motStatus==='reagendar';}).length;
  const pendente=total-done-ausente-reagendar;
  const statusSegs=[
    {value:done,color:'var(--tx)',label:t('mot.status_coletado')},
    {value:ausente,color:'#94a3b8',label:t('mot.status_ausente')},
    {value:reagendar,color:'var(--pu)',label:t('mot.status_reagendar')},
    {value:pendente,color:'var(--bd)',label:t('mot.status_pendente')}
  ];
  const pctDone=total?Math.round((done+ausente+reagendar)/total*100):0;
  // 2) Pagamento
  const pixPago=orderList.filter(i=>{const c=_gc(i);return c&&c._motPay==='Pix (pago)';}).length;
  const pixCobrar=orderList.filter(i=>{const c=_gc(i);return c&&c._motPay==='Pix (cobrar)';}).length;
  const cartao=orderList.filter(i=>{const c=_gc(i);return c&&c._motPay==='Cart\xe3o';}).length;
  const dinheiro=orderList.filter(i=>{const c=_gc(i);return c&&c._motPay==='Dinheiro';}).length;
  const semPay=total-pixPago-pixCobrar-cartao-dinheiro;
  const paySegs=[
    {value:pixPago,color:'var(--tx)',label:t('mot.pix_paid')},
    {value:cartao,color:'#64748b',label:t('mot.card')},
    {value:dinheiro,color:'var(--pu)',label:t('mot.cash')},
    {value:pixCobrar,color:'#94a3b8',label:t('mot.pix_charge')},
    {value:semPay,color:'var(--bd)',label:t('mot.no_payment')}
  ];
  const payTotal=pixPago+pixCobrar+cartao+dinheiro;
  // 3) Recebido vs A Cobrar
  let recebido=0,aCobrar=0;
  orderList.forEach(i=>{
    const c=_gc(i);if(!c)return;
    const v=parseFloat(c.val)||0;
    if(!v||c.valTipo==='pago'||c.valTipo==='medir')return;
    if(c._motPay==='Pix (cobrar)')aCobrar+=v;
    else if(c._motPay)recebido+=v;
  });
  const valSegs=[
    {value:recebido,color:'var(--tx)',label:t('comp.received')},
    {value:aCobrar,color:'var(--pu)',label:t('comp.to_charge')}
  ];
  return '<div class="mot-charts">'
    +'<div class="mot-chart-item">'+buildDonutSVG(statusSegs,pctDone+'%',t('mot.chart.progress'))+'<div class="mot-chart-label">'+t('mot.chart.status')+'</div>'+buildDonutLegend(statusSegs)+'</div>'
    +'<div class="mot-chart-item">'+buildDonutSVG(paySegs,payTotal,t('mot.chart.of')+' '+total)+'<div class="mot-chart-label">'+t('mot.chart.payment')+'</div>'+buildDonutLegend(paySegs)+'</div>'
    +'<div class="mot-chart-item">'+buildDonutSVG(valSegs,'R$'+fmtBRL(recebido),(aCobrar?t('mot.chart.to_charge'):t('mot.chart.received')))+'<div class="mot-chart-label">'+t('mot.chart.values')+'</div>'+buildDonutLegend(valSegs)+'</div>'
  +'</div>';
}
function renderMotor(){
  const el=g('motor-body');const dateEl=g('motor-date');
  if(!clients.length){el.innerHTML='<div class="empty"><span style="font-size:28px;opacity:.3">'+mi('map')+'</span><p>'+t('mot.buildroute')+'</p></div>';dateEl.textContent='';return;}
  const _gestorReadonly=!_isMotoristaMode&&_currentRouteId&&_cloudVersion>0;
  const d=clients[0]?.data?new Date(clients[0].data+'T12:00').toLocaleDateString(_lang==='en'?'en-US':'pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}):'';
  dateEl.textContent=d;
  const tapR=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('coleta'));}).reduce((s,c)=>s+(c.qtd||0),0);
  const tapE=clients.filter(c=>{const t=normalizeTipo(c.tipo);return t.includes(_resolveTagId('entrega'));}).reduce((s,c)=>s+(c.qtd||0),0);
  const doneCount=order.filter(i=>clients[i]._motDone).length;
  // Resumo
  let html='<div class="mot-summary">'
    +'<div class="ms-item"><div class="ms-label">'+t('mot.stops')+'</div><div class="ms-val">'+clients.length+'</div></div>'
    +'<div class="ms-item"><div class="ms-label">'+t('mot.pickup')+'</div><div class="ms-val">'+tapR+'</div></div>'
    +'<div class="ms-item"><div class="ms-label">'+t('mot.deliver')+'</div><div class="ms-val">'+tapE+'</div></div>'
    +'<div class="ms-item"><div class="ms-label">'+t('mot.completed')+'</div><div class="ms-val">'+doneCount+'/'+clients.length+'</div></div>'
    +(cfg.saida?'<div class="ms-item"><div class="ms-label">'+t('mot.departure')+'</div><div class="ms-val">'+cfg.saida+'</div></div>':'')
    +'</div>';
  // Banner gestor acompanhamento
  if(_gestorReadonly){
    html+='<div style="border:2px solid var(--pu);border-radius:14px;padding:14px 16px;margin-bottom:12px;font-size:13px;display:flex;gap:12px;align-items:center;background:var(--sf)">'
      +'<span style="font-size:20px">'+mi('eye')+'</span>'
      +'<div><div style="font-weight:700;color:var(--tx)">'+t('mot.tracking')+'</div>'
      +'<div style="color:var(--mu);font-size:12px;margin-top:2px">'+t('mot.tracking_desc')+'</div>'
      +(_motoristaViewedAt?'<div style="color:var(--gnd);font-size:11px;margin-top:4px;font-weight:600">'+mi('check','mot-ico-sm')+' '+t('mot.viewed_at')+' '+new Date(_motoristaViewedAt).toLocaleTimeString(_lang==='en'?'en-US':'pt-BR',{hour:'2-digit',minute:'2-digit'})+'</div>':'<div style="color:var(--mu);font-size:11px;margin-top:4px;opacity:.6">'+t('mot.awaiting')+'</div>')
      +'</div></div>';
  }
  // v4.8.8: Gráficos donut só para gestor (Philip: motorista não precisa de dashboards)
  if(_gestorReadonly)html+=buildChartsHTML(clients,order);
  // Partida
  if(cfg.base)html+='<div style="border:1px solid var(--bd);border-radius:14px;padding:14px 16px;margin-bottom:12px;font-size:14px;display:flex;gap:12px;align-items:center;background:var(--sf)"><span style="opacity:.35">'+mi('building')+'</span><div><div style="font-weight:700;font-size:13px;color:var(--tx)">'+t('map.departure')+'</div><div style="color:var(--mu);font-size:12px">'+cfg.base+'</div></div></div>';
  // Cards dos clientes
  html+=order.map((idx,stop)=>{
    const c=clients[idx];
    const isDone=!!c._motDone;
    const isActive=!isDone&&stop===order.findIndex(i=>!clients[i]._motDone);
    const tipos=normalizeTipo(c.tipo);const isCol=tipos.includes(_resolveTagId('coleta'));
    const statusLabel=isCol?t('mot.status_coletado'):t('mot.status_entregue');
    const statusClass=isCol?'s-coletado':'s-entregue';
    const navAddr=encodeURIComponent(c.endereco+', S\xe3o Paulo, SP');
    const wazeUrl='https://waze.com/ul?q='+navAddr+'&navigate=yes';
    const gmapsUrl='https://www.google.com/maps/dir/?api=1&destination='+navAddr+'&travelmode=driving';
    return '<div class="mot-card '+(isCol?'col':'ent')+(isActive?' active':'')+(isDone?' done':'')+'" id="mot-card-'+idx+'">'
      // Banner de concluído
      +(isDone?'<div class="mc-done-banner">'
        +'<span class="mot-ico" style="opacity:.4">'+MI[c._motStatus==='ausente'?'x':c._motStatus==='reagendar'?'refresh':'check']+'</span> '
        +(c._motStatus==='coletado'?t('mot.status_coletado'):c._motStatus==='entregue'?t('mot.status_entregue'):c._motStatus==='ausente'?t('mot.status_ausente'):c._motStatus==='reagendar'?t('mot.status_reagendado'):(c._motStatus||''))
        +(c._motPay?' \u2014 '+c._motPay:'')
        +(!_gestorReadonly?'<button class="mc-done-edit" onclick="event.stopPropagation();editDoneCard('+idx+')">'+mi('edit','mot-ico-sm')+' '+t('mot.editar')+'</button>':'')
        +'</div>':'')
      // Top: número + tipo + horário
      +'<div class="mc-top">'
        +'<div class="mc-top-left">'
          +'<div class="mc-num">'+(stop+1)+'</div>'
          +'<span class="mc-tipo">'+(_getTagLabel(tipos[0])||(isCol?t('mot.coleta'):t('mot.entrega')))+'</span>'
        +'</div>'
        +(c.estT?'<div class="mc-time">'+c.estT+'</div>':'')
      +'</div>'
      // Nome + endereço
      +'<div class="mc-name">'+c.nome+'</div>'
      +'<div class="mc-addr">'+fmtEnderecoComCidade(c)+'</div>'
      // Detalhes
      +'<div class="mc-details">'
        +(c.qtd?'<span class="mc-detail">'+mi('bag','mot-ico-sm')+' '+c.qtd+' '+(cfg._itemLabel||'item')+(c.qtd>1?'s':'')+'</span>':'')
        +(c.val&&c.valTipo!=='medir'&&c.valTipo!=='pago'?'<span class="mc-detail">R$ '+fmtBRL(c.val)+'</span>':'')
        +(c.valTipo==='medir'?'<span class="mc-detail alert">'+mi('scale','mot-ico-sm')+' '+t('form.medir')+'</span>':'')
        +(c.valTipo==='pago'?'<span class="mc-detail">'+mi('check','mot-ico-sm')+' '+t('form.pago')+'</span>':'')
        +(c.janela&&c.janela!=='livre'?'<span class="mc-detail alert">'+mi('clock','mot-ico-sm')+' '+t('card.until')+' '+(c.hf||'12h')+'</span>':'')
      +'</div>'
      // Telefone
      +(c.tel?'<a href="tel:'+c.tel+'" class="mc-tel">'+mi('phone')+' '+c.tel+'</a>':'')
      // Observação do gestor
      +(c.obs?'<div style="padding:0 18px 12px;font-size:12px;color:var(--mu);font-style:italic;font-weight:500">'+c.obs+'</div>':'')
      // Separador + ações (ou resumo readonly do gestor)
      +(!isDone?(_gestorReadonly?
        // ── Gestor readonly: mostra status atual sem botões ──
        (c._motStatus||c._motPay||c._motObs?
          '<div class="mc-sep"></div>'
          +'<div style="padding:8px 18px 14px;font-size:12px;color:var(--mu)">'
            +(c._motStatus?'<span style="display:inline-flex;align-items:center;gap:4px;background:var(--s2);border-radius:8px;padding:4px 10px;margin-right:6px;font-weight:600;color:var(--tx)">'+mi('check','mot-ico-sm')+' '+(c._motStatus==='coletado'?t('mot.status_coletado'):c._motStatus==='entregue'?t('mot.status_entregue'):c._motStatus==='ausente'?t('mot.status_ausente'):c._motStatus==='reagendar'?t('mot.status_reagendado'):c._motStatus)+'</span>':'')
            +(c._motPay?'<span style="display:inline-flex;align-items:center;gap:4px;background:var(--s2);border-radius:8px;padding:4px 10px;font-weight:600;color:var(--tx)">'+c._motPay+'</span>':'')
            +(c._motObs?'<div style="margin-top:8px;font-style:italic;color:var(--mu)">Obs: '+c._motObs+'</div>':'')
          +'</div>'
        :'<div style="padding:8px 18px 14px;font-size:12px;color:var(--mu);opacity:.5">'+t('mot.awaiting_driver')+'</div>')
      :
        // ── Motorista interativo: todos os botões ──
        '<div class="mc-sep"></div>'
        +'<div class="mc-actions">'
          +'<div class="mc-nav-row">'
            +'<a href="'+wazeUrl+'" target="_blank" class="mc-nav-btn" onclick="autoConcludePrev('+stop+')">'+mi('nav')+' Waze</a>'
            +'<a href="'+gmapsUrl+'" target="_blank" class="mc-nav-btn primary" onclick="autoConcludePrev('+stop+')">'+mi('pin')+' Google Maps</a>'
          +'</div>'
          +'<div class="mc-status-row">'
            +'<button class="mc-status-btn '+statusClass+(c._motStatus===(isCol?'coletado':'entregue')?' selected':'')+'" onclick="event.stopPropagation();setMotStatus('+idx+',&#39;'+(isCol?'coletado':'entregue')+'&#39;)">'+mi('check')+' '+statusLabel+'</button>'
            +'<button class="mc-status-btn s-ausente'+(c._motStatus==='ausente'?' selected':'')+'" onclick="event.stopPropagation();setMotStatus('+idx+',&#39;ausente&#39;)">'+mi('x')+' '+t('mot.status_ausente')+'</button>'
          +'</div>'
          +'<button class="mc-status-btn s-reagendar'+(c._motStatus==='reagendar'?' selected':'')+'" style="width:100%" onclick="event.stopPropagation();setMotStatus('+idx+',&#39;reagendar&#39;)">'+mi('refresh')+' '+t('mot.status_reagendar')+'</button>'
          +'<div class="mc-pay-section" style="padding:0">'
            +'<div class="mc-pay-label">'+t('mot.payment')+'</div>'
            +'<div class="mc-pay-row">'
              +'<button class="mc-pay-btn'+(c._motPay==='Pix (pago)'?' selected':'')+'" onclick="event.stopPropagation();setMotPay('+idx+',&#39;Pix (pago)&#39;)">'+mi('check','mot-ico-sm')+' '+t('mot.pix_paid')+'</button>'
              +'<button class="mc-pay-btn'+(c._motPay==='Pix (cobrar)'?' selected':'')+'" onclick="event.stopPropagation();setMotPay('+idx+',&#39;Pix (cobrar)&#39;)">'+mi('clock','mot-ico-sm')+' '+t('mot.pix_charge')+'</button>'
              +'<button class="mc-pay-btn'+(c._motPay==='Cart\xe3o'?' selected':'')+'" onclick="event.stopPropagation();setMotPay('+idx+',&#39;Cart\xe3o&#39;)">'+mi('card','mot-ico-sm')+' '+t('mot.card')+'</button>'
              +'<button class="mc-pay-btn'+(c._motPay==='Dinheiro'?' selected':'')+'" onclick="event.stopPropagation();setMotPay('+idx+',&#39;Dinheiro&#39;)">'+mi('dollar','mot-ico-sm')+' '+t('mot.cash')+'</button>'
            +'</div>'
          +'</div>'
          +'<div class="mc-obs-section" style="padding:0">'
            +'<textarea class="mc-obs-input" id="mot-obs-'+idx+'" rows="2" placeholder="'+t('mot.obs_placeholder')+'" onchange="setMotObs('+idx+',this.value)">'+(c._motObs||'')+'</textarea>'
          +'</div>'
          +'<button class="mc-conclude-btn" onclick="event.stopPropagation();finishMotClient('+idx+')">'+mi('check')+' '+t('mot.concluir')+'</button>'
        +'</div>'
      ):'')
    +'</div>';
  }).join('');
  // Retorno
  if(cfg.retaddr)html+='<div style="border:1px solid var(--bd);border-radius:14px;padding:14px 16px;margin-top:4px;font-size:14px;display:flex;gap:12px;align-items:center;background:var(--sf)"><span style="opacity:.35">'+mi('home')+'</span><div><div style="font-weight:700;font-size:13px;color:var(--tx)">Retorno</div><div style="color:var(--mu);font-size:12px">'+cfg.retaddr+'</div></div></div>';
  // Rota completa
  if(clients.length>1){
    const addrs=order.map(i=>encodeURIComponent(clients[i].endereco));
    const orig=cfg.base?encodeURIComponent(cfg.base):addrs[0];
    const dest=cfg.retaddr?encodeURIComponent(cfg.retaddr):(cfg.base?encodeURIComponent(cfg.base):addrs[addrs.length-1]);
    const url='https://www.google.com/maps/dir/'+orig+'/'+addrs.join('/')+'/'+dest;
    html+='<a href="'+url+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:12px;background:var(--sf);border:1px solid var(--bd);font-size:14px;font-weight:700;color:var(--tx);text-decoration:none;margin-top:16px;transition:all .15s">'+mi('map')+' Abrir rota completa</a>';
  }
  el.innerHTML=html;
}
// ── Anti-scroll: evita cliques acidentais durante rolagem ──
let _motScrolling=false,_motScrollT;
document.addEventListener('touchmove',()=>{_motScrolling=true;clearTimeout(_motScrollT);_motScrollT=setTimeout(()=>_motScrolling=false,300);},{passive:true});
document.addEventListener('touchend',()=>{setTimeout(()=>_motScrolling=false,100);},{passive:true});

// ── Auto-concluir cards anteriores quando interage com o próximo ──
function autoConcludePrev(currentStop){
  let changed=false;
  for(let s=0;s<currentStop;s++){
    const i=order[s];
    if(clients[i]._motStatus&&!clients[i]._motDone){
      // Capturar obs se tiver algo digitado
      const ta=document.getElementById('mot-obs-'+i);
      if(ta&&ta.value.trim()){clients[i]._motObs=ta.value.trim();cloudUpdateStatus(i,'obs',clients[i]._motObs);}
      clients[i]._motDone=true;
      cloudUpdateStatus(i,'done',true);
      changed=true;
    }
  }
  if(changed){recalcDynamicETAs();saveHist();renderMotor();checkCompletion();}
}

// ── Status do motorista por cliente ──
function setMotStatus(idx,status){
  if(_motScrolling)return;
  const c=clients[idx];
  // Auto-concluir anteriores
  const stop=order.indexOf(idx);
  if(stop>0)autoConcludePrev(stop);
  if(c._motStatus===status){c._motStatus=null;} // toggle off
  else{c._motStatus=status;}
  recalcDynamicETAs();
  renderMotor();
  const card=document.getElementById('mot-card-'+idx);
  if(card)card.scrollIntoView({behavior:'smooth',block:'center'});
  toast(c.nome+': '+(c._motStatus||t('msg.status_removed')),'ok');
  cloudUpdateStatus(idx,'status',c._motStatus);
  saveHist();
  autoSaveRoute(); // v4.7.2: persist to rota_ativa from motorist mode
}
function setMotPay(idx,pay){
  if(_motScrolling)return;
  const c=clients[idx];
  // Auto-concluir anteriores
  const stop=order.indexOf(idx);
  if(stop>0)autoConcludePrev(stop);
  if(c._motPay===pay){c._motPay=null;}
  else{c._motPay=pay;}
  renderMotor();
  cloudUpdateStatus(idx,'pay',c._motPay);
  saveHist(); // v4.7.2: persist payment to history
  autoSaveRoute(); // v4.7.2: persist to rota_ativa from motorist mode
}
function setMotObs(idx,obs){
  clients[idx]._motObs=obs;
  clearTimeout(clients[idx]._obsTimeout);
  clients[idx]._obsTimeout=setTimeout(()=>{cloudUpdateStatus(idx,'obs',obs);saveHist();},2000); // v4.7.2: persist obs to history (debounced)
}
// ── Concluir card manualmente ──
function finishMotClient(idx){
  if(_motScrolling)return;
  const c=clients[idx];
  const ta=document.getElementById('mot-obs-'+idx);
  if(ta&&ta.value.trim()){c._motObs=ta.value.trim();cloudUpdateStatus(idx,'obs',c._motObs);}
  // v4.7.3: Se nenhum status foi marcado, assumir coletado/entregue automaticamente
  if(!c._motStatus){
    const isCol=normalizeTipo(c.tipo).includes(_resolveTagId('coleta'));
    c._motStatus=isCol?'coletado':'entregue';
    cloudUpdateStatus(idx,'status',c._motStatus);
  }
  c._motDone=true;
  cloudUpdateStatus(idx,'done',true);
  recalcDynamicETAs();
  saveHist();
  autoSaveRoute(); // v4.7.2: persist to rota_ativa from motorist mode
  renderMotor();
  checkCompletion();
  // v4.7.3: Toast reflete o status REAL selecionado pelo motorista
  const statusLabels={coletado:t('mot.status_coletado'),entregue:t('mot.status_entregue'),ausente:t('mot.status_ausente'),reagendar:t('mot.status_reagendado')};
  toast(c.nome+': '+(statusLabels[c._motStatus]||c._motStatus),'ok');
}
// ── Reabrir card concluído para edição ──
function editDoneCard(idx){
  if(_motScrolling)return;
  clients[idx]._motDone=false;
  renderMotor();
  const card=document.getElementById('mot-card-'+idx);
  if(card)card.scrollIntoView({behavior:'smooth',block:'center'});
  toast(clients[idx].nome+': '+t('msg.editing'),'ok');
}

// v4.4.1: Bairro hover highlight on heatmap
let _bairroHighlightCircle=null;
function highlightBairro(lat,lng){
  if(!hmMap)return;
  if(_bairroHighlightCircle){_bairroHighlightCircle.setMap(null);_bairroHighlightCircle=null;}
  if(lat&&lng){
    _bairroHighlightCircle=new google.maps.Circle({
      map:hmMap,center:{lat:parseFloat(lat),lng:parseFloat(lng)},
      radius:1500,fillColor:'#6C5CE7',fillOpacity:.18,
      strokeColor:'#6C5CE7',strokeWeight:2,strokeOpacity:.5
    });
    hmMap.panTo({lat:parseFloat(lat),lng:parseFloat(lng)});
  }
}
function clearBairroHighlight(){
  if(_bairroHighlightCircle){_bairroHighlightCircle.setMap(null);_bairroHighlightCircle=null;}
}
function highlightBairroByName(name,el){
  if(!_bairroCoords||!_bairroCoords[name])return;
  const coords=_bairroCoords[name];
  const avgLat=coords.lats.reduce((a,b)=>a+b,0)/coords.lats.length;
  const avgLng=coords.lngs.reduce((a,b)=>a+b,0)/coords.lngs.length;
  highlightBairro(avgLat,avgLng);
}

// v4.4.0: Remove client from sidebar (map expanded)
function removeCFromSidebar(id){
  const c=clients.find(x=>x.id===id);if(!c)return;
  showConfirmToast(t('confirm.remove_toast',{name:c.nome}),()=>{
    clients=clients.filter(x=>x.id!==id);
    order=clients.map((_,i)=>i);
    renderC();updStats();updBtns();
    if(!clients.length)resetMap();
    else if(gRoute&&gMap)recalcRouteFromOrder(); // v5.8.31: atualiza marcadores e rota no mapa
    if(mapIsFullscreen)updateMapSidebar();
    toast(t('t.removed'),'');
  });
}

// v4.4.0: Sug 2 — Confirmation toast before deleting
let _confirmToastTimer=null;
function showConfirmToast(msg,onConfirm){
  let ct=document.getElementById('confirm-toast-el');
  if(!ct){
    ct=document.createElement('div');
    ct.id='confirm-toast-el';
    ct.className='confirm-toast';
    document.body.appendChild(ct);
  }
  clearTimeout(_confirmToastTimer);
  ct.innerHTML='<span class="ct-msg">'+msg+'</span><div class="ct-actions"><button class="ct-btn ct-no" onclick="hideConfirmToast()">'+t('btn.no')+'</button><button class="ct-btn ct-yes" id="ct-yes-btn">'+t('btn.yes')+'</button></div>';
  ct.classList.add('show');
  document.getElementById('ct-yes-btn').onclick=function(){hideConfirmToast();onConfirm();};
  _confirmToastTimer=setTimeout(hideConfirmToast,8000);
}
function hideConfirmToast(){
  const ct=document.getElementById('confirm-toast-el');
  if(ct)ct.classList.remove('show');
  clearTimeout(_confirmToastTimer);
}

// v4.4.0: Sug 1 — Cloud sync feedback indicator
let _syncIndicatorTimer=null;
function showSyncIndicator(state,msg){
  let el=document.getElementById('sync-ind');
  if(!el){
    // v4.6.9: Fallback — normalmente já existe no body
    el=document.createElement('div');
    el.id='sync-ind';
    el.className='sync-indicator';
    document.body.appendChild(el);
  }
  clearTimeout(_syncIndicatorTimer);
  // v4.7.4: SVG inline em vez de emojis
  const _si='<svg style="width:12px;height:12px;vertical-align:-1px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">';
  const icons={ok:_si+'<polyline points="20 6 9 17 4 12"/></svg>',saving:_si+'<path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>',err:_si+'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'};
  el.className='sync-indicator '+state;
  el.innerHTML='<span>'+(icons[state]||'')+'</span> '+(msg||state);
  el.classList.add('show');
  _syncIndicatorTimer=setTimeout(()=>{el.classList.remove('show');},3000);
}
// Hook into cloudPublish
const _origCloudPublish=cloudPublish;
cloudPublish=async function(){
  showSyncIndicator('saving','Sincronizando...');
  try{const _ok=await _origCloudPublish();showSyncIndicator(_ok===false?'err':'ok',_ok===false?'Falha ao sincronizar':'Sincronizado');}
  catch(e){showSyncIndicator('err','Erro ao sincronizar');}
};
// Also hook into toast for saves
const _origToast=toast;
if(typeof toast==='function'){
  const _wrappedToast=function(msg,type){
    _origToast(msg,type);
    if(type==='ok'&&(msg.includes('adicionado')||msg.includes('atualizado')||msg.includes('removido')||msg.includes('publicada'))){
      showSyncIndicator('ok','Salvo');
    }
  };
  // Don't override toast here to avoid recursion, just call showSyncIndicator from specific places
}

// v4.4.0: Sug 3 — Keyboard shortcut tooltips
function addShortcutHints(){
  // Main form
  const cform=document.getElementById('cform');
  if(cform&&!cform.querySelector('.shortcut-hint')){
    const hint=document.createElement('div');
    hint.className='shortcut-hint';
    hint.innerHTML='<kbd>Enter</kbd> Salvar &nbsp; <kbd>Esc</kbd> Fechar';
    hint.style.cssText='text-align:right;margin-top:6px';
    const btns=cform.querySelector('div[style*="margin-top:14px"]');
    if(btns)btns.appendChild(hint);
  }
  // Edit modal
  const editModal=document.querySelector('#edit-modal .ma');
  if(editModal&&!editModal.querySelector('.shortcut-hint')){
    const hint=document.createElement('div');
    hint.className='shortcut-hint';
    hint.innerHTML='<kbd>Enter</kbd> Salvar &nbsp; <kbd>Esc</kbd> Fechar';
    hint.style.cssText='margin-left:auto;align-self:center';
    editModal.appendChild(hint);
  }
  // Smart Insert modal
  const siModal=document.querySelector('#smart-insert-modal .ma');
  if(siModal&&!siModal.querySelector('.shortcut-hint')){
    const hint=document.createElement('div');
    hint.className='shortcut-hint';
    hint.innerHTML='<kbd>Enter</kbd> Inserir &nbsp; <kbd>Esc</kbd> Fechar';
    hint.style.cssText='margin-left:auto;align-self:center';
    siModal.appendChild(hint);
  }
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(addShortcutHints,800));

// v4.4.0: Sug 4 — Skeleton loading while rendering
function showSkeletonLoading(containerId,count){
  const el=document.getElementById(containerId);if(!el)return;
  let html='';
  for(let i=0;i<count;i++){
    html+='<div class="skeleton-card">'
      +'<div class="skeleton-circle"></div>'
      +'<div style="flex:1;display:flex;flex-direction:column;gap:6px">'
        +'<div class="skeleton-line" style="width:'+(60+Math.random()*30)+'%;height:13px"></div>'
        +'<div class="skeleton-line" style="width:'+(40+Math.random()*40)+'%;height:10px;opacity:.6"></div>'
      +'</div>'
    +'</div>';
  }
  el.innerHTML=html;
}


// ====== v4.5.1: ROUTE LEARNING SYSTEM ======
let _routeLearnings=safeJsonParse('rota_learnings',[]);
function saveRouteLearning(beforeOrder,afterOrder,improvement){
  // Save the pattern: which reordering improved the route
  const pattern={timestamp:Date.now(),before:beforeOrder.slice(0,8),after:afterOrder.slice(0,8),
    improvement:improvement,clientCount:clients.length};
  _routeLearnings.push(pattern);
  if(_routeLearnings.length>100)_routeLearnings=_routeLearnings.slice(-100);
  localStorage.setItem('rota_learnings',JSON.stringify(_routeLearnings));
  console.log('[LEARNING] Padr\xe3o salvo:',improvement);
}
// Enhanced pushRouteState to track learning
const _origPushRouteState=pushRouteState;
pushRouteState=function(){
  _origPushRouteState();
  // Save pre-change metrics for learning comparison
  if(_routeHistory.length>0){
    const last=_routeHistory[_routeHistory.length-1];
    last._prevTotalMin=_routeTotalMin;last._prevTotalKm=_routeTotalKm;
  }
};
// After recalcRouteFromOrder, check if manual change improved route
const _origRecalcRoute=recalcRouteFromOrder;
recalcRouteFromOrder=async function(){
  const prevMin=_routeTotalMin;const prevKm=_routeTotalKm;const prevOrder=[...order];
  await _origRecalcRoute.call(this);
  // Compare: did the manual change improve things?
  const minDiff=prevMin-_routeTotalMin;const kmDiff=prevKm-_routeTotalKm;
  if(minDiff>1||kmDiff>0.5){
    saveRouteLearning(prevOrder,[...order],{minSaved:Math.round(minDiff),kmSaved:+kmDiff.toFixed(1)});
    // Show learning badge briefly
    const badge=document.querySelector('.learn-badge');
    if(badge){badge.style.display='inline-flex';badge.textContent='\u{1F9E0} Sistema aprendeu com seu ajuste';
      setTimeout(()=>{badge.style.display='none';},4000);}
  }
};

// ====== v4.6.0: HEATMAP REVENUE MODE ======
let _heatmapMode='concentration'; // 'concentration' or 'revenue'
function rerenderHeatmap(){
  if(!hmMap)return;
  const hist=getHist();const allC=hist.flatMap(h=>h.clients);
  if(!allC.length)return;
  if(hmHeatLayer)hmHeatLayer.setMap(null);
  if(_heatmapMode==='revenue'){
    // Revenue heatmap — weight by value
    const data=[];
    if(_dashCache.loaded&&_dashCache.pts){
      allC.forEach((c,i)=>{
        if(_dashCache.pts[i]){
          const val=parseFloat(c.val)||1;
          data.push({location:new google.maps.LatLng(_dashCache.pts[i][0],_dashCache.pts[i][1]),weight:val});
        }
      });
    }
    hmHeatLayer=_makeHeatmap({data,radius:40,map:hmMap, // v5.8.40: canvas heatmap
      gradient:['rgba(0,0,0,0)','rgba(34,197,94,.3)','rgba(34,197,94,.6)','rgba(255,203,0,.7)','rgba(255,123,0,.8)','rgba(226,68,92,1)']});
  } else {
    // Normal concentration heatmap
    if(_dashCache.loaded&&_dashCache.pts){
      hmHeatLayer=_makeHeatmap({data:_dashCache.pts.map(pt=>new google.maps.LatLng(pt[0],pt[1])),radius:35,map:hmMap}); // v5.8.40: canvas heatmap
    }
  }
}

// v4.6.1: generateDayGroupings removido

// ====== v4.5.1: WHATSAPP NOTIFICATION ======
// v4.6.1: generateWppMessages, sendWppMessage, sendAllWpp removidos

// v4.6.1: generatePostRouteReport, renderPostRouteReport removidos

// v4.6.1: WhatsApp notifications + post-route report removidos da sidebar
