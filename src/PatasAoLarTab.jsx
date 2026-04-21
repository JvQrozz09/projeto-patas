import React, { useState } from 'react';
import MapaSelecao from './MapaSelecao';

const PatasAoLarTab = () => {
  // ESTADOS 
  const [telaAtual, setTelaAtual] = useState('feed'); 
  const [tipoCadastro, setTipoCadastro] = useState('');
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
      descricao: 'Visto pela última vez perto da praça. Estava com coleira azul e muito assustado.',
    }
  ]);

  // FUNÇÃO PARA REMOVER ANIMAL 
  const removerAnimal = (id) => {
    const novaLista = animais.filter(animal => animal.id !== id);
    setAnimais(novaLista);
  };

  // --- FILTRO E BUSCA ---
  const animaisFiltrados = animais.filter(animal => {
    const bateCategoria = 
      filtroAtivo === 'Todos' || 
      (filtroAtivo === 'Perdidos' && animal.status === 'Perdido') ||
      (filtroAtivo === 'Encontrados' && animal.status === 'Encontrado') ||
      (filtroAtivo === 'Cachorros' && animal.especie === 'Cachorro') ||
      (filtroAtivo === 'Gatos' && animal.especie === 'Gato');

    const termoBusca = busca.toLowerCase();
    const bateBusca = 
      animal.nome.toLowerCase().includes(termoBusca) ||
      animal.raca.toLowerCase().includes(termoBusca) ||
      animal.local.toLowerCase().includes(termoBusca) ||
      animal.especie.toLowerCase().includes(termoBusca);

    return bateCategoria && bateBusca;
  });

  const abrirCadastro = (tipo) => {
    setTipoCadastro(tipo);
    setTelaAtual('cadastro');
  };

  // --- TELA DE CADASTRO ---
  if (telaAtual === 'cadastro') {
    return (
      <div className="flex flex-col h-full bg-white w-full max-w-4xl mx-auto font-sans min-h-screen">
        <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-20">
          <button onClick={() => setTelaAtual('feed')} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">
            {tipoCadastro === 'perdi' ? 'Cadastrar Pet Perdido' : 'Animal Encontrado'}
          </h1>
        </div>

        <div className="p-4 flex flex-col gap-4 pb-10">
          <div className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-4xl mb-2">🐾</span>
            <span className="font-medium">Adicionar Foto</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <input type="text" placeholder="Espécie (Ex: Cachorro)" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
            <input type="text" placeholder="Raça" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
            <input type="text" placeholder="Cor principal" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span className="text-emerald-500">📍</span> Onde ele foi visto?
            </label>
            <MapaSelecao aoSelecionarLocal={(coords) => console.log("Coordenadas capturadas:", coords)} />
            <input type="text" placeholder="Ponto de referência" className="w-full p-4 mt-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
          </div>

          <button className="w-full bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl mt-4 shadow-lg active:scale-[0.98]">
            Enviar Alerta
          </button>
        </div>
      </div>
    );
  }

  // TELA DE FORNECER INFORMAÇÕES 
  if (telaAtual === 'informacoes') {
    return (
      <div className="flex flex-col h-full bg-white w-full max-w-4xl mx-auto font-sans min-h-screen">
        <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-20">
          <button onClick={() => { setTelaAtual('feed'); setTipoInformacao(''); }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">Ajudar o {petSelecionado?.nome}</h1>
        </div>

        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <img src={petSelecionado?.img} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
            <div>
              <p className="text-sm text-emerald-800 font-bold">Você viu o {petSelecionado?.nome}?</p>
              <p className="text-xs text-emerald-600 leading-relaxed">Sua informação pode ser fundamental!</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-bold text-gray-700">O que você deseja fazer?</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setTipoInformacao('pista')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${tipoInformacao === 'pista' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${tipoInformacao === 'pista' ? 'border-emerald-500 text-emerald-500' : 'border-gray-400 text-gray-400'}`}>
                  <span className="text-lg font-black">?</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${tipoInformacao === 'pista' ? 'text-emerald-700' : 'text-gray-500'}`}>Tenho uma pista</span>
              </button>

              <button 
                onClick={() => setTipoInformacao('resgate')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${tipoInformacao === 'resgate' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}
              >
                <span className="text-2xl">🏠</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${tipoInformacao === 'resgate' ? 'text-emerald-700' : 'text-gray-500'}`}>Estou com o pet</span>
              </button>
            </div>

            {tipoInformacao && (
              <div className="flex flex-col gap-4 mt-2">
                <input type="text" placeholder="Seu Nome" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400" />
                <textarea placeholder={tipoInformacao === 'pista' ? "Onde e quando viu?" : "Como ele está?"} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-28 focus:outline-none focus:border-emerald-400 resize-none"></textarea>
                
                {tipoInformacao === 'resgate' && (
                  <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] font-bold uppercase">Foto do Pet</span>
                  </div>
                )}

                <button 
                  className="w-full bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl mt-2 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  onClick={() => alert('Mensagem enviada!')}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path></svg>
                  Enviar e Chamar no Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TELA PRINCIPAL
  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] w-full max-w-4xl mx-auto pb-20 font-sans shadow-xl min-h-screen relative">
      <div className="bg-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar animais perdidos..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide text-sm">
          {['Todos', 'Perdidos', 'Encontrados', 'Cachorros', 'Gatos'].map((filtro) => (
            <button
              key={filtro}
              onClick={() => setFiltroAtivo(filtro)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                filtroAtivo === filtro ? 'bg-emerald-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 grid grid-cols-2 gap-4">
        <button onClick={() => abrirCadastro('perdi')} className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-red-100 group transition-all cursor-pointer">
          <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">😿</span>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">Perdi meu Pet</span>
        </button>

        <button onClick={() => abrirCadastro('encontrei')} className="flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-emerald-50 hover:border-emerald-100 group transition-all cursor-pointer">
          <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🐶</span>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">Encontrei um Pet</span>
        </button>
      </div>

      <div className="px-4 flex flex-col gap-6">
        {animaisFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-5xl opacity-50">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum pet encontrado</h3>
            <p className="text-gray-500 text-sm">A lista está vazia no momento.</p>
            <button onClick={() => { setFiltroAtivo('Todos'); setBusca(''); }} className="mt-6 text-emerald-500 font-medium">Limpar filtros</button>
          </div>
        ) : (
          animaisFiltrados.map((animal) => (
            <div key={animal.id} className="relative w-full h-[450px] rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-shadow">
              <img src={animal.img} alt={animal.nome} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="absolute top-4 left-4">
                <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase shadow-md ${animal.status === 'Perdido' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {animal.status}
                </span>
              </div>

              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <span className="text-white text-xs font-medium">📍 {animal.distancia}</span>
              </div>

              <div className="absolute bottom-0 w-full p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{animal.nome}</h2>
                <p className="text-sm text-gray-200 mb-4 line-clamp-2">{animal.descricao}</p>
                
                <div className="flex gap-2 mb-4">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">#{animal.especie}</span>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">#{animal.raca}</span>
                </div>

                <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20">
                  {/* BOTÃO X */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removerAnimal(animal.id); }}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors border border-white/10 shadow-lg"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPetSelecionado(animal); setTelaAtual('informacoes'); }}
                    className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-all active:scale-95 group animate-pulse-slow shadow-xl grid place-items-center cursor-pointer"
                  >
                    <svg className="w-full h-full p-3 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatasAoLarTab;