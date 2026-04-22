import React, { useState, useRef } from 'react';
import MapaSelecao from './MapaSelecao';

const PatasAoLarTab = () => {
  // --- ESTADOS ---
  const [telaAtual, setTelaAtual] = useState('feed'); 
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [tipoInformacao, setTipoInformacao] = useState('');

  // Banco de dados simulado
  const [animais, setAnimais] = useState([
    {
      id: 1,
      nome: 'Bobby',
      status: 'Perdido',
      especie: 'Cachorro',
      raca: 'Vira-Lata',
      local: 'São Paulo, SP',
      data: '17/04/2026',
      distancia: '500m',
      img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop',
      descricao: 'Visto pela última vez perto da praça. Estava com coleira azul.',
      tags: ['Dócil']
    }
  ]);

  const [novoPet, setNovoPet] = useState({
    nome: '', especie: '', raca: '', descricao: '', status: 'Perdido', img: null, preview: null
  });
  
  const fileInputRef = useRef(null);

  // --- LÓGICA DE IMAGEM ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (novoPet.preview) URL.revokeObjectURL(novoPet.preview); // Limpa memória do navegador
      setNovoPet({ ...novoPet, img: file, preview: URL.createObjectURL(file) });
    }
  };

  // --- AÇÕES ---
  const cadastrarAnimal = () => {
    if (!novoPet.especie || !novoPet.preview) return alert("Adicione uma foto e a espécie!");
    
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
      tags: []
    };

    setAnimais([novoObjeto, ...animais]);
    setTelaAtual('feed');
    setNovoPet({ nome: '', especie: '', raca: '', descricao: '', status: 'Perdido', img: null, preview: null });
  };

  // Previne que o clique no botão de excluir abra a tela do pet
  const removerAnimal = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Deseja remover este alerta?")) {
      setAnimais(animais.filter(a => a.id !== id));
    }
  };

  // --- FILTROS ---
  const animaisFiltrados = animais.filter(animal => {
    const bateCategoria = filtroAtivo === 'Todos' || 
      (filtroAtivo === 'Perdidos' && animal.status === 'Perdido') ||
      (filtroAtivo === 'Encontrados' && animal.status === 'Encontrado') ||
      (filtroAtivo === 'Cachorros' && animal.especie === 'Cachorro') ||
      (filtroAtivo === 'Gatos' && animal.especie === 'Gato');
    
    const termo = busca.toLowerCase();
    return bateCategoria && (animal.nome.toLowerCase().includes(termo) || animal.especie.toLowerCase().includes(termo));
  });

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
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-emerald-50 transition-colors relative group"
          >
            {novoPet.preview ? (
              <img src={novoPet.preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center">
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📸</span>
                <p className="text-gray-500 font-bold">Anexar foto do animal</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input value={novoPet.nome} onChange={e => setNovoPet({...novoPet, nome: e.target.value})} placeholder="Nome (Opcional)" className="p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-emerald-500 outline-none transition-colors" />
            <input value={novoPet.especie} onChange={e => setNovoPet({...novoPet, especie: e.target.value})} placeholder="Espécie*" className="p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-emerald-500 outline-none transition-colors" />
          </div>

          <textarea value={novoPet.descricao} onChange={e => setNovoPet({...novoPet, descricao: e.target.value})} placeholder="Descrição e detalhes..." className="w-full p-4 bg-gray-50 rounded-2xl h-32 border border-gray-100 focus:border-emerald-500 outline-none resize-none transition-colors" />

          <div className="rounded-[2.5rem] overflow-hidden border border-gray-200">
            {/* Certifique-se de que este componente não está quebrando. Se não tiver mapa, comente esta linha temporariamente */}
            <MapaSelecao aoSelecionarLocal={(c) => console.log(c)} />
          </div>

          <button onClick={cadastrarAnimal} className="w-full bg-emerald-500 text-white font-bold py-5 rounded-[2rem] shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">
            Publicar Alerta
          </button>
        </div>
      </div>
    );
  }

  // 2. TELA DE INFORMAÇÕES (AJUDA)
  if (telaAtual === 'informacoes' && petSelecionado) {
    return (
      <div className="flex flex-col min-h-screen bg-white max-w-4xl mx-auto">
        <header className="p-4 border-b flex items-center gap-4 sticky top-0 bg-white z-50">
          <button onClick={() => {setTelaAtual('feed'); setTipoInformacao('');}} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="font-bold text-xl text-gray-800">Ajudar {petSelecionado.nome}</h1>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex gap-4 p-4 bg-emerald-50 rounded-3xl items-center border border-emerald-100">
            <img src={petSelecionado.img} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt="" />
            <div>
              <p className="font-bold text-emerald-900 text-lg">Você viu este pet?</p>
              <p className="text-emerald-700 text-sm">Sua pista pode salvar uma vida.</p>
            </div>
          </div>

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

          {tipoInformacao && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <textarea placeholder={tipoInformacao === 'pista' ? "Onde e quando você o viu?" : "Conte-nos como ele está e onde vocês estão..."} className="w-full p-4 bg-gray-50 rounded-2xl h-32 border border-gray-200 focus:border-emerald-500 outline-none resize-none transition-colors" />
              <button onClick={() => {alert('Informação enviada com sucesso!'); setTelaAtual('feed');}} className="w-full bg-emerald-500 text-white font-bold py-5 rounded-[2rem] shadow-lg hover:bg-emerald-600 active:scale-95 transition-all">
                Enviar Mensagem
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. TELA PRINCIPAL (FEED)
  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFF] max-w-4xl mx-auto pb-24 font-sans">
      
      {/* HEADER E BUSCA */}
      <div className="bg-white px-6 pt-10 pb-8 sticky top-0 z-40 rounded-b-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black tracking-tighter text-gray-900">Patas ao Lar<span className="text-emerald-500">.</span></h1>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">🐾</div>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar por raça, cor ou local..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:border-emerald-400 outline-none transition-colors"
          />
          <span className="absolute left-4 top-4 opacity-40">🔍</span>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO INDEPENDENTES (DESTAQUE) */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">
        <button 
          onClick={() => { setNovoPet({...novoPet, status: 'Perdido'}); setTelaAtual('cadastro'); }} 
          className="group p-6 bg-white rounded-[2.5rem] shadow-md border-2 border-red-50 hover:border-red-200 flex items-center gap-5 transition-all active:scale-95 cursor-pointer"
        >
          <div className="text-4xl bg-red-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">😿</div>
          <div className="text-left">
            <span className="block text-lg font-black text-gray-800">Perdi meu Pet</span>
            <span className="text-xs text-gray-500 font-medium">Criar um alerta de busca</span>
          </div>
        </button>

        <button 
          onClick={() => { setNovoPet({...novoPet, status: 'Encontrado'}); setTelaAtual('cadastro'); }} 
          className="group p-6 bg-white rounded-[2.5rem] shadow-md border-2 border-emerald-50 hover:border-emerald-200 flex items-center gap-5 transition-all active:scale-95 cursor-pointer"
        >
          <div className="text-4xl bg-emerald-50 p-4 rounded-3xl group-hover:scale-110 transition-transform">🐶</div>
          <div className="text-left">
            <span className="block text-lg font-black text-gray-800">Encontrei um Pet</span>
            <span className="text-xs text-gray-500 font-medium">Informar animal resgatado</span>
          </div>
        </button>
      </div>

      {/* FILTROS DE CATEGORIA */}
      <div className="px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {['Todos', 'Perdidos', 'Encontrados', 'Cachorros', 'Gatos'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroAtivo(f)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                filtroAtivo === f ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
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
            <p>Nenhum pet encontrado com esses filtros...</p>
          </div>
        ) : (
          animaisFiltrados.map((animal) => (
            <div key={animal.id} className="bg-white rounded-[3rem] overflow-hidden shadow-lg border border-gray-100 relative hover:shadow-xl transition-shadow">
              <div className="relative h-80">
                <img src={animal.img} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${animal.status === 'Perdido' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {animal.status}
                  </span>
                </div>

                <div className="absolute bottom-6 left-8 text-white">
                  <h2 className="text-3xl font-black mb-1 drop-shadow-md">{animal.nome}</h2>
                  <p className="text-xs opacity-90 font-medium drop-shadow-md">📍 {animal.local} • {animal.distancia}</p>
                </div>

                <div className="absolute bottom-6 right-6 flex gap-2">
                   <button 
                    onClick={(e) => removerAnimal(e, animal.id)}
                    className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                  <button 
                    onClick={() => { setPetSelecionado(animal); setTelaAtual('informacoes'); }}
                    className="px-6 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold shadow-lg transition-colors"
                  >
                    Ajudar
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
    </div>
  );
};

export default PatasAoLarTab;