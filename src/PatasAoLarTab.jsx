import React, { useState, useRef, useMemo } from 'react';
import MapaSelecao from './MapaSelecao';

const PatasAoLarTab = () => {
  // --- ESTADOS PRINCIPAIS ---
  const [telaAtual, setTelaAtual] = useState('feed'); 
  const [filtroAtivo, setFiltroAtivo] = useState('Alertas Recentes'); 
  const [busca, setBusca] = useState('');
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [tipoInformacao, setTipoInformacao] = useState('');
  const [abaGerenciar, setAbaGerenciar] = useState('alertas');

  // --- ESTADOS DE UI (AVISOS E MODAL) ---
  const [toast, setToast] = useState({ show: false, mensagem: '', tipo: 'success' });
  const [modal, setModal] = useState({ isOpen: false, titulo: '', mensagem: '', onConfirm: null });
  const [errosCadastro, setErrosCadastro] = useState({});
  const [errosAjuda, setErrosAjuda] = useState({});

  const [dadosAjuda, setDadosAjuda] = useState({
    nome: '', telefone: '', email: '', mensagem: '', foto: null, preview: null
  });

  const [animais, setAnimais] = useState([
    {
      id: 1, nome: 'Bobby', status: 'Perdido', especie: 'Cachorro', raca: 'Vira-Lata', local: 'São Paulo, SP', data: '17/04/2026', distancia: '500m',
      img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      descricao: 'Visto pela última vez perto da praça. Estava com coleira azul.', tags: ['Dócil'], isMeu: true
    },
    {
      id: 2, nome: 'Sem Nome', status: 'Encontrado', especie: 'Gato', raca: 'SRD', local: 'Rio de Janeiro, RJ', data: '20/04/2026', distancia: '2km',
      img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
      descricao: 'Encontrado miando muito no telhado de casa. Gato preto com mancha branca.', tags: ['Assustado'], isMeu: false
    },
    {
      id: 3, nome: 'Luna', status: 'Resolvido', especie: 'Cachorro', raca: 'Golden Retriever', local: 'Curitiba, PR', data: '10/04/2026', distancia: '5km',
      img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
      descricao: 'Graças ao app, a Luna voltou para casa hoje cedo! Muito obrigado a todos.', tags: ['Feliz'], isMeu: false
    },
    {
      id: 4, nome: 'Frederico', status: 'Perdido', especie: 'Calopsita', raca: 'Silvestre', local: 'Belo Horizonte, MG', data: '21/04/2026', distancia: '1km',
      img: 'https://images.unsplash.com/photo-1552728089-57169ab00d08?q=80&w=600&auto=format&fit=crop',
      descricao: 'Voou pela janela. Tem as bochechas bem laranjas e canta a música do Mario.', tags: ['Arisco'], isMeu: false
    }
  ]);

  const [ongs] = useState([
    { id: 1, nome: 'Abrigo Cão Feliz', endereco: 'Rua das Flores, 123 - Zona Sul', telefone: '(11) 99999-0000', status: 'Vagas Abertas', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop' },
    { id: 2, nome: 'Gatinhos da Vila', endereco: 'Av. Paulista, 1000 - Bela Vista', telefone: '(11) 98888-1111', status: 'Superlotado', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=600&auto=format&fit=crop' },
    { id: 3, nome: 'Recanto Silvestre', endereco: 'Rodovia Raposo Tavares, Km 20', telefone: '(11) 97777-2222', status: 'Vagas Limitadas', img: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=600&auto=format&fit=crop' }
  ]);

  const [novoPet, setNovoPet] = useState({
    nome: '', especie: '', raca: '', descricao: '', status: 'Perdido', img: null, preview: null
  });
  
  const fileInputRef = useRef(null);
  const fotoAjudaRef = useRef(null);

  // --- FUNÇÕES DE UI (TOAST E MODAL) ---
  const mostrarToast = (mensagem, tipo = 'success') => {
    setToast({ show: true, mensagem, tipo });
    setTimeout(() => setToast({ show: false, mensagem: '', tipo: 'success' }), 3500);
  };

  const confirmarAcao = (titulo, mensagem, onConfirm) => {
    setModal({ isOpen: true, titulo, mensagem, onConfirm });
  };

  const fecharModal = () => {
    setModal({ isOpen: false, titulo: '', mensagem: '', onConfirm: null });
  };

  // --- LÓGICA DE COMPARTILHAMENTO ---
  const compartilharPet = (e, animal) => {
    e.stopPropagation();
    const texto = `Ajude o ${animal.nome !== 'Sem Nome' ? animal.nome : 'pet'}! Ele foi ${animal.status.toLowerCase()} em ${animal.local}. Veja mais no Patas ao Lar!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Patas ao Lar',
        text: texto,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${texto} - ${window.location.href}`);
      mostrarToast('Copiado para a área de transferência!', 'success');
    }
  };

  // --- LÓGICA DE IMAGEM ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (novoPet.preview) URL.revokeObjectURL(novoPet.preview);
      setNovoPet({ ...novoPet, img: file, preview: URL.createObjectURL(file) });
      setErrosCadastro(prev => ({...prev, foto: null})); 
    }
  };

  const handleFotoAjudaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (dadosAjuda.preview) URL.revokeObjectURL(dadosAjuda.preview);
      setDadosAjuda({ ...dadosAjuda, foto: file, preview: URL.createObjectURL(file) });
    }
  };

  // --- AÇÕES COM VALIDAÇÃO ---
  const cadastrarAnimal = () => {
    let erros = {};
    if (!novoPet.preview) erros.foto = "A foto é obrigatória";
    if (!novoPet.especie.trim()) erros.especie = "A espécie é obrigatória";
    
    if (Object.keys(erros).length > 0) {
      setErrosCadastro(erros);
      mostrarToast('Preencha os campos obrigatórios!', 'error');
      return;
    }
    
    const novoObjeto = {
      id: Date.now(),
      nome: novoPet.nome || 'Sem nome',
      status: novoPet.status,
      especie: novoPet.especie,
      raca: novoPet.raca || 'SRD',
      local: 'Localização fixada',
      data: new Date().toLocaleDateString('pt-BR'),
      distancia: '0m',
      img: novoPet.preview,
      descricao: novoPet.descricao,
      tags: [],
      isMeu: true
    };

    setAnimais([novoObjeto, ...animais]);
    setTelaAtual('feed');
    setFiltroAtivo('Alertas Recentes'); 
    setNovoPet({ nome: '', especie: '', raca: '', descricao: '', status: 'Perdido', img: null, preview: null });
    setErrosCadastro({});
    mostrarToast('Alerta publicado com sucesso!');
  };

  const enviarAjuda = () => {
    let erros = {};
    if (!dadosAjuda.nome.trim()) erros.nome = "Seu nome é obrigatório";
    if (!dadosAjuda.telefone.trim()) erros.telefone = "Seu telefone é obrigatório";
    if (!dadosAjuda.mensagem.trim()) erros.mensagem = "Por favor, digite os detalhes";

    if (Object.keys(erros).length > 0) {
      setErrosAjuda(erros);
      mostrarToast('Preencha as informações de contato e a mensagem!', 'error');
      return;
    }

    mostrarToast('Informação enviada com sucesso! O autor será notificado.');
    setTelaAtual('feed');
    setTipoInformacao('');
    setDadosAjuda({ nome: '', telefone: '', email: '', mensagem: '', foto: null, preview: null });
    setErrosAjuda({});
  };

  const removerAnimal = (e, id) => {
    if (e) e.stopPropagation();
    confirmarAcao(
      "Excluir Alerta",
      "Deseja remover esta publicação permanentemente? Esta ação não pode ser desfeita.",
      () => {
        setAnimais(prev => prev.filter(a => a.id !== id));
        mostrarToast('Publicação removida com sucesso.', 'success');
      }
    );
  };

  const marcarComoResolvido = (e, id) => {
    if (e) e.stopPropagation();
    confirmarAcao(
      "Que ótima notícia!",
      "Deseja marcar este caso como resolvido? Ele será movido para a aba de finais felizes.",
      () => {
        setAnimais(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolvido' } : a));
        mostrarToast('Caso marcado como resolvido! 🎉', 'success');
      }
    );
  };

  // --- FILTROS OTIMIZADOS COM USEMEMO ---
  const animaisFiltrados = useMemo(() => {
    return animais.filter(animal => {
      let bateCategoria = false;
      const especieAnimal = animal.especie.toLowerCase();
      
      if (filtroAtivo === 'Alertas Recentes') bateCategoria = animal.status !== 'Resolvido'; 
      else if (filtroAtivo === 'Encontrados pelo Patas ao Lar') bateCategoria = animal.status === 'Resolvido'; 
      else if (filtroAtivo === 'Cachorros') bateCategoria = animal.status !== 'Resolvido' && especieAnimal === 'cachorro';
      else if (filtroAtivo === 'Gatos') bateCategoria = animal.status !== 'Resolvido' && especieAnimal === 'gato';
      else if (filtroAtivo === 'Outras Espécies') bateCategoria = animal.status !== 'Resolvido' && !['cachorro', 'gato'].includes(especieAnimal);
      
      const termo = busca.toLowerCase();
      return bateCategoria && (animal.nome.toLowerCase().includes(termo) || animal.especie.toLowerCase().includes(termo) || animal.local.toLowerCase().includes(termo));
    });
  }, [animais, filtroAtivo, busca]);

  const meusAnimais = useMemo(() => animais.filter(animal => animal.isMeu), [animais]);

  const getStatusColor = (status) => {
    if (status === 'Perdido') return 'bg-red-500';
    if (status === 'Encontrado') return 'bg-emerald-500';
    if (status === 'Resolvido') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getOngStatusColor = (status) => {
    if (status === 'Vagas Abertas') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Superlotado') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getPlaceholderMensagem = () => {
    if (tipoInformacao === 'pista') return "Onde e quando você o viu? Como ele estava?";
    if (tipoInformacao === 'resgate') return "Conte-nos como ele está, onde vocês estão e qual o melhor horário para buscar...";
    if (tipoInformacao === 'dono') return "Que ótimo! Descreva detalhes que comprovem que é seu pet (marcas, cicatrizes, comportamento)...";
    if (tipoInformacao === 'conhecido') return "Quem é o dono? Como podemos entrar em contato com ele ou com você para o reencontro?";
    return "Digite sua mensagem...";
  };

  // --- TELAS CONDICIONAIS ---

  // 1. TELA DE CADASTRO
  if (telaAtual === 'cadastro') {
    return (
      <div className="flex flex-col min-h-screen bg-white max-w-4xl mx-auto">
        <header className="p-4 border-b flex items-center gap-4 sticky top-0 bg-white z-50">
          <button onClick={() => setTelaAtual('feed')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="font-bold text-xl text-gray-800">{novoPet.status === 'Perdido' ? 'Reportar Perda' : 'Animal Encontrado'}</h1>
        </header>

        <div className="p-6 space-y-6 pb-20">
          <div>
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`w-full h-64 bg-gray-50 border-2 border-dashed ${errosCadastro.foto ? 'border-red-400 bg-red-50' : 'border-gray-300'} rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-50 transition-colors relative group`}
            >
              {novoPet.preview ? (
                <img src={novoPet.preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center">
                  <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📸</span>
                  <p className={`${errosCadastro.foto ? 'text-red-500' : 'text-gray-500'} font-bold`}>Anexar foto do animal*</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            {errosCadastro.foto && <p className="text-red-500 text-xs font-bold mt-2 ml-2">{errosCadastro.foto}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input value={novoPet.nome} onChange={e => setNovoPet({...novoPet, nome: e.target.value})} placeholder="Nome (Opcional)" className="p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-emerald-500 outline-none transition-colors" />
            <div>
              <input value={novoPet.especie} onChange={e => { setNovoPet({...novoPet, especie: e.target.value}); setErrosCadastro(prev => ({...prev, especie: null})) }} placeholder="Espécie*" className={`w-full p-4 bg-gray-50 rounded-2xl border ${errosCadastro.especie ? 'border-red-400' : 'border-gray-100'} focus:border-emerald-500 outline-none transition-colors`} />
              {errosCadastro.especie && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errosCadastro.especie}</p>}
            </div>
          </div>

          <textarea value={novoPet.descricao} onChange={e => setNovoPet({...novoPet, descricao: e.target.value})} placeholder="Descrição e detalhes..." className="w-full p-4 bg-gray-50 rounded-2xl h-32 border border-gray-100 focus:border-emerald-500 outline-none resize-none transition-colors" />

          <div className="rounded-[2.5rem] overflow-hidden border border-gray-200">
            <MapaSelecao aoSelecionarLocal={(c) => console.log(c)} />
          </div>

          <button onClick={cadastrarAnimal} className="w-full bg-emerald-500 text-white font-bold py-5 rounded-[2rem] shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">
            Publicar Alerta
          </button>
        </div>
        
        {toast.show && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-xl text-white font-bold transition-all ${toast.tipo === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {toast.mensagem}
          </div>
        )}
      </div>
    );
  }

  // 2. TELA DE INFORMAÇÕES (AJUDA)
  if (telaAtual === 'informacoes' && petSelecionado) {
    return (
      <div className="flex flex-col min-h-screen bg-white max-w-4xl mx-auto">
        <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => {
              setTelaAtual('feed'); 
              setTipoInformacao('');
              setDadosAjuda({ nome: '', telefone: '', email: '', mensagem: '', foto: null, preview: null });
              setErrosAjuda({});
            }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              {petSelecionado.status === 'Resolvido' ? `História de ${petSelecionado.nome}` : `Ajudar ${petSelecionado.nome !== 'Sem Nome' ? petSelecionado.nome : 'este pet'}`}
            </h1>
          </div>
          <button onClick={(e) => compartilharPet(e, petSelecionado)} className="p-2 hover:bg-gray-100 rounded-full text-emerald-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
        </header>

        <div className="p-6 space-y-6 pb-24">
          <div className={`flex gap-4 p-4 rounded-3xl items-center border ${petSelecionado.status === 'Resolvido' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <img src={petSelecionado.img} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
            <div>
              {petSelecionado.status === 'Resolvido' ? (
                <>
                  <p className="font-bold text-blue-900 text-lg">Final Feliz! 🎉</p>
                  <p className="text-blue-700 text-sm">Graças à comunidade, este pet está a salvo.</p>
                </>
              ) : petSelecionado.status === 'Encontrado' ? (
                <>
                  <p className="font-bold text-emerald-900 text-lg">Reconhece este pet?</p>
                  <p className="text-emerald-700 text-sm">Ajude-o a voltar para sua família.</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-emerald-900 text-lg">Você viu este pet?</p>
                  <p className="text-emerald-700 text-sm">Sua pista pode salvar uma vida.</p>
                </>
              )}
            </div>
          </div>

          {petSelecionado.status === 'Resolvido' ? (
            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
              <span className="text-6xl block mb-4">🏠</span>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Caso Resolvido</h3>
              <p className="text-gray-500">Este alerta foi fechado pelo autor da publicação e o animal já está seguro. Obrigado a todos que ajudaram a compartilhar!</p>
            </div>
          ) : (
            <>
              {petSelecionado.status === 'Perdido' ? (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setTipoInformacao('pista')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${tipoInformacao === 'pista' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <span className="text-3xl block mb-2">🔍</span>
                    <span className="font-bold text-xs uppercase text-gray-700">Tenho uma pista</span>
                  </button>
                  <button onClick={() => setTipoInformacao('resgate')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${tipoInformacao === 'resgate' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <span className="text-3xl block mb-2">🏠</span>
                    <span className="font-bold text-xs uppercase text-gray-700">Estou com ele</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setTipoInformacao('dono')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${tipoInformacao === 'dono' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <span className="text-3xl block mb-2">❤️</span>
                    <span className="font-bold text-xs uppercase text-gray-700">É meu pet!</span>
                  </button>
                  <button onClick={() => setTipoInformacao('conhecido')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${tipoInformacao === 'conhecido' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <span className="text-3xl block mb-2">🗣️</span>
                    <span className="font-bold text-xs uppercase text-gray-700 text-center">Conheço o dono</span>
                  </button>
                </div>
              )}

              {tipoInformacao && (
                <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 ml-1">Seus Contatos</h3>
                    <div>
                      <input value={dadosAjuda.nome} onChange={e => {setDadosAjuda({...dadosAjuda, nome: e.target.value}); setErrosAjuda(p => ({...p, nome: null}))}} placeholder="Seu Nome*" className={`w-full p-4 bg-gray-50 rounded-2xl border ${errosAjuda.nome ? 'border-red-400' : 'border-gray-100'} focus:border-emerald-500 outline-none transition-colors`} />
                      {errosAjuda.nome && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errosAjuda.nome}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input value={dadosAjuda.telefone} onChange={e => {setDadosAjuda({...dadosAjuda, telefone: e.target.value}); setErrosAjuda(p => ({...p, telefone: null}))}} placeholder="Telefone / WhatsApp*" className={`w-full p-4 bg-gray-50 rounded-2xl border ${errosAjuda.telefone ? 'border-red-400' : 'border-gray-100'} focus:border-emerald-500 outline-none transition-colors`} />
                        {errosAjuda.telefone && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errosAjuda.telefone}</p>}
                      </div>
                      <input value={dadosAjuda.email} onChange={e => setDadosAjuda({...dadosAjuda, email: e.target.value})} placeholder="E-mail (Opcional)" className="p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-bold text-gray-800 ml-1 mb-3">Conseguiu tirar uma foto? (Opcional)</h3>
                    <div 
                      onClick={() => fotoAjudaRef.current.click()}
                      className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-50 transition-colors relative group"
                    >
                      {dadosAjuda.preview ? (
                        <img src={dadosAjuda.preview} className="w-full h-full object-cover" alt="Preview da foto" />
                      ) : (
                        <div className="text-center">
                          <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📸</span>
                          <p className="text-gray-500 text-sm font-bold">Adicionar foto comprobatória</p>
                        </div>
                      )}
                      <input type="file" ref={fotoAjudaRef} onChange={handleFotoAjudaChange} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-bold text-gray-800 ml-1 mb-3">Detalhes</h3>
                    <textarea 
                      value={dadosAjuda.mensagem} 
                      onChange={e => {setDadosAjuda({...dadosAjuda, mensagem: e.target.value}); setErrosAjuda(p => ({...p, mensagem: null}))}} 
                      placeholder={getPlaceholderMensagem()} 
                      className={`w-full p-4 bg-gray-50 rounded-2xl h-32 border ${errosAjuda.mensagem ? 'border-red-400' : 'border-gray-200'} focus:border-emerald-500 outline-none resize-none transition-colors`} 
                    />
                    {errosAjuda.mensagem && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errosAjuda.mensagem}</p>}
                  </div>

                  <button onClick={enviarAjuda} className="w-full bg-emerald-500 text-white font-bold py-5 rounded-[2rem] shadow-lg hover:bg-emerald-600 active:scale-95 transition-all mt-4">
                    Enviar Informações
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {toast.show && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-xl text-white font-bold transition-all ${toast.tipo === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {toast.mensagem}
          </div>
        )}
      </div>
    );
  }

  // 3. TELA DE GERENCIAMENTO (MINHAS PUBLICAÇÕES E ONGS)
  if (telaAtual === 'gerenciar') {
    return (
      <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-4xl mx-auto pb-24 font-sans relative">
        <header className="p-4 border-b flex items-center gap-4 sticky top-0 bg-white z-40">
          <button onClick={() => setTelaAtual('feed')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="font-bold text-xl text-gray-800">Painel</h1>
        </header>

        <div className="flex px-6 pt-6 gap-3">
          <button onClick={() => setAbaGerenciar('alertas')} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${abaGerenciar === 'alertas' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>Meus Alertas</button>
          <button onClick={() => setAbaGerenciar('ongs')} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${abaGerenciar === 'ongs' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>Procurar ONGs</button>
        </div>

        {abaGerenciar === 'alertas' ? (
          <div className="p-6 space-y-4">
            {meusAnimais.length === 0 ? (
              <div className="text-center py-20 opacity-40 font-bold flex flex-col items-center">
                <span className="text-5xl mb-4">📭</span>
                <p>Você ainda não fez nenhuma publicação.</p>
              </div>
            ) : (
              meusAnimais.map((animal) => (
                <div key={animal.id} className={`bg-white p-4 rounded-3xl shadow-sm border ${animal.status === 'Resolvido' ? 'border-blue-100' : 'border-gray-100'} flex flex-col sm:flex-row gap-4 items-center`}>
                  <img src={animal.img} className={`w-24 h-24 rounded-2xl object-cover ${animal.status === 'Resolvido' ? 'grayscale-[30%]' : ''}`} alt="" />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-gray-800">{animal.nome}</h3>
                    <p className="text-sm text-gray-500">{animal.especie} • Publicado em {animal.data}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${getStatusColor(animal.status)}`}>{animal.status}</span>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {animal.status !== 'Resolvido' && (
                      <button onClick={(e) => marcarComoResolvido(e, animal.id)} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors">Marcar Resolvido</button>
                    )}
                    <button onClick={(e) => removerAnimal(e, animal.id)} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors">Excluir Alerta</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm mb-2 text-center">Encontrou um animal e não pode dar lar temporário? Entre em contato com as ONGs parceiras mais próximas:</p>
            {ongs.map((ong) => (
              <div key={ong.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
                <img src={ong.img} className="w-24 h-24 rounded-2xl object-cover" alt={ong.nome} />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg text-gray-800">{ong.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 {ong.endereco}</p>
                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getOngStatusColor(ong.status)}`}>{ong.status}</span>
                  </div>
                </div>
                <div className="flex flex-col w-full sm:w-auto mt-2 sm:mt-0">
                  <a href={`tel:${ong.telefone}`} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-sm transition-colors"><span>📞</span> Ligar</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPONENTES FLUTUANTES NO GERENCIAR */}
        {toast.show && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-xl text-white font-bold transition-all ${toast.tipo === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {toast.mensagem}
          </div>
        )}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in duration-200">
              <h3 className="text-xl font-black text-gray-900 mb-2">{modal.titulo}</h3>
              <p className="text-gray-600 mb-6">{modal.mensagem}</p>
              <div className="flex gap-3">
                <button onClick={fecharModal} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-colors">Cancelar</button>
                <button onClick={() => { modal.onConfirm(); fecharModal(); }} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors">Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. TELA PRINCIPAL (FEED)
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-4xl mx-auto pb-24 font-sans relative">
      
      {/* HEADER E BUSCA */}
      <div className="bg-white px-6 pt-10 pb-8 sticky top-0 z-40 rounded-b-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black tracking-tighter text-gray-900">Patas ao Lar<span className="text-emerald-500">.</span></h1>
          <div className="flex gap-3">
            <button onClick={() => setTelaAtual('gerenciar')} className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors" title="Painel e ONGs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">🐾</div>
          </div>
        </div>

        <div className="relative">
          <input type="text" placeholder="Buscar por raça, cor ou local..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:border-emerald-400 outline-none transition-colors" />
          <span className="absolute left-4 top-4 opacity-40">🔍</span>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">
        <button onClick={() => { setNovoPet({...novoPet, status: 'Perdido'}); setTelaAtual('cadastro'); }} className="group p-6 bg-white rounded-[2.5rem] shadow-md border-2 border-red-50 hover:border-red-200 flex items-center gap-5 transition-all active:scale-95">
          <div className="text-4xl bg-red-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">😿</div>
          <div className="text-left"><span className="block text-lg font-black text-gray-800">Perdi meu Pet</span><span className="text-xs text-gray-500 font-medium">Criar um alerta de busca</span></div>
        </button>

        <button onClick={() => { setNovoPet({...novoPet, status: 'Encontrado'}); setTelaAtual('cadastro'); }} className="group p-6 bg-white rounded-[2.5rem] shadow-md border-2 border-emerald-50 hover:border-emerald-200 flex items-center gap-5 transition-all active:scale-95">
          <div className="text-4xl bg-emerald-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">🐶</div>
          <div className="text-left"><span className="block text-lg font-black text-gray-800">Encontrei um Pet</span><span className="text-xs text-gray-500 font-medium">Informar animal resgatado</span></div>
        </button>
      </div>

      {/* FILTROS DE CATEGORIA */}
      <div className="px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {['Alertas Recentes', 'Cachorros', 'Gatos', 'Outras Espécies', 'Encontrados pelo Patas ao Lar'].map((f) => (
            <button key={f} onClick={() => setFiltroAtivo(f)} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${filtroAtivo === f ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* LISTAGEM DE ANIMAIS */}
      <div className="px-6 space-y-8 z-10">
        {animaisFiltrados.length === 0 ? (
          <div className="text-center py-20 opacity-40 font-bold flex flex-col items-center">
            <span className="text-5xl mb-4">📭</span>
            <p>Nenhum pet encontrado nesta categoria...</p>
          </div>
        ) : (
          animaisFiltrados.map((animal) => (
            <div key={animal.id} className={`bg-white rounded-[3rem] overflow-hidden shadow-lg border border-gray-100 relative hover:shadow-xl transition-shadow ${animal.status === 'Resolvido' ? 'opacity-90' : ''}`}>
              <div className="relative h-80">
                <img src={animal.img} className={`w-full h-full object-cover ${animal.status === 'Resolvido' ? 'grayscale-[20%]' : ''}`} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${getStatusColor(animal.status)}`}>{animal.status}</span>
                </div>

                <div className="absolute bottom-6 left-8 text-white pr-4">
                  <h2 className="text-3xl font-black mb-1 drop-shadow-md">{animal.nome}</h2>
                  <p className="text-xs opacity-90 font-medium drop-shadow-md">📍 {animal.local} {animal.status !== 'Resolvido' && `• ${animal.distancia}`}</p>
                </div>

                <div className="absolute bottom-6 right-6 flex gap-2">
                  <button onClick={(e) => compartilharPet(e, animal)} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors" title="Compartilhar Alerta">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  <button onClick={() => { setPetSelecionado(animal); setTelaAtual('informacoes'); }} className={`px-6 h-12 text-white rounded-full font-bold shadow-lg transition-colors ${animal.status === 'Resolvido' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                    {animal.status === 'Resolvido' ? 'Ver História' : 'Ajudar'}
                  </button>
                </div>
              </div>
              <div className="p-8 bg-white">
                <p className="text-gray-600 text-sm italic leading-relaxed">"{animal.descricao}"</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RODAPÉ */}
      <div className="px-6 mt-12 mb-8">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-red-900">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🚨</span>
            <h3 className="font-black text-lg">Denuncie Maus-Tratos</h3>
          </div>
          <p className="text-sm mb-5 text-red-800">Maus-tratos a animais é crime ambiental. Se presenciar agressões, abandono ou negligência, não hesite em denunciar aos órgãos competentes.</p>
          <ul className="space-y-3 text-sm font-medium">
            <li className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-red-50"><span className="text-gray-700">Polícia Militar (Flagrantes)</span><span className="font-black text-red-600 text-lg">190</span></li>
            <li className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-red-50"><span className="text-gray-700">Disque Denúncia (Anônimo)</span><span className="font-black text-red-600 text-lg">181</span></li>
            <li className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-red-50"><span className="text-gray-700">IBAMA (Animais Silvestres)</span><span className="font-black text-red-600 text-md">0800 61 8080</span></li>
          </ul>
        </div>
      </div>

      {/* TOAST FLUTUANTE NO FEED */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-xl text-white font-bold transition-all ${toast.tipo === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.mensagem}
        </div>
      )}
    </div>
  );
};

export default PatasAoLarTab;