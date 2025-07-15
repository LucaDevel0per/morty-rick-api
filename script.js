async function buscarPersonagem(nome) {
    let url = `https://rickandmortyapi.com/api/character/?page=1`
    let encontrado = false;
    let personagem = null

    while (!encontrado && url) {
        try {
            const res = await fetch(url);
            const data = await res.json();

            personagem = data.results.find(p => 
                p.name.toLowerCase() === nome.toLowerCase()
            )

            if (personagem) {
                encontrado = true;
                console.log( "✅ Personagem encontrado:", personagem.name)
                console.log("status:",personagem.status)
            } else {
                url = data.info.next;
            }
        } catch (error) {
            console.error('Erro ao buscar personagem:', error);
            break;
        }
    }
    console.log(personagem)
    return personagem;
}

document.getElementById('buscarBtn').addEventListener('click', buscarPersonagem2);
document.getElementById('nome').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarPersonagem2();
    }
});

async function buscarPersonagem2() {
    const nome = document.getElementById('nome').value.trim();

    if (!nome) {
        const resultado = document.getElementById('resultado');
        resultado.innerHTML = `
            <div class="error">
                ⚠️ Por favor, digite o nome de um personagem para viajar pelo multiverso!
            </div>
        `;
        return;
    }
    
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>🌀 Viajando pelas dimensões em busca de ${nome}...</p>
        </div>
    `;

    try {
        const personagem = await buscarPersonagem(nome)
        if (personagem) {
            const imageUrl = personagem.image;
            console.log("URL da imagem:", imageUrl)

            let imagemHtml = '';
            if (imageUrl) {
                imagemHtml = `
                    <img src="${imageUrl}"
                         alt="${personagem.name}"
                         width="250"
                         style="border-radius: 15px; margin: 20px 0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(65, 255, 0, 0.3); transition: transform 0.3s ease;"
                         onload="this.style.animation='fadeInUp 0.6s ease'"
                         onerror="this.style.display='none';"
                    />
                `;
            }

            // Função para obter emoji baseado no status
            function getStatusEmoji(status) {
                switch(status?.toLowerCase()) {
                    case 'alive': return '💚';
                    case 'dead': return '💀';
                    case 'unknown': return '❓';
                    default: return '🔍';
                }
            }

            // Função para obter emoji baseado no gênero  
            function getGenderEmoji(gender) {
                switch(gender?.toLowerCase()) {
                    case 'male': return '👨';
                    case 'female': return '👩';
                    case 'genderless': return '🤖';
                    case 'unknown': return '❓';
                    default: return '👽';
                }
            }

            // Função para obter emoji baseado na espécie
            function getSpeciesEmoji(species) {
                switch(species?.toLowerCase()) {
                    case 'human': return '👤';
                    case 'alien': return '👽';
                    case 'humanoid': return '🧬';
                    case 'robot': return '🤖';
                    case 'cronenberg': return '🧟';
                    case 'animal': return '🐾';
                    case 'disease': return '🦠';
                    case 'mythological creature': return '🐉';
                    default: return '🔬';
                }
            }

            resultado.innerHTML = `
                <div class="character-card">
                    <h2>🎯 ${personagem.name}</h2> 
                    ${imagemHtml}
                    <div style="display: grid; gap: 15px; margin-top: 25px;">
                        <p><strong>Status:</strong> ${getStatusEmoji(personagem.status)} ${personagem.status || 'Desconhecido'}</p>
                        <p><strong>Gênero:</strong> ${getGenderEmoji(personagem.gender)} ${personagem.gender || 'Desconhecido'}</p>
                        <p><strong>Espécie:</strong> ${getSpeciesEmoji(personagem.species)} ${personagem.species || 'Desconhecida'}</p>
                        <p><strong>Origem:</strong> 🌍 ${personagem.origin?.name || 'Desconhecida'}</p>
                        <p><strong>Localização:</strong> 📍 ${personagem.location?.name || 'Desconhecida'}</p>
                        <p><strong>Episódios:</strong> 📺 ${personagem.episode?.length || 0} episódio(s)</p>
                    </div>
                </div>
            `;

        } else {
            resultado.innerHTML = `
                <div class="not-found">
                    <h3>🛸 Personagem Não Encontrado!</h3>
                    <p>❌ Não conseguimos localizar "${nome}" em nenhuma dimensão conhecida.</p>
                    <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                        💡 Dica: Tente nomes como "Rick Sanchez", "Morty Smith", "Summer Smith", "Jerry Smith", "Beth Smith"...
                    </p>
                </div>
            `;
        }
    } catch(e) {
        resultado.innerHTML = `
            <div class="error">
                <h3>💥 Erro na Viagem Interdimensional!</h3>
                <p>🚨 ${e.message}</p>
                <p style="margin-top: 15px; font-size: 0.9rem;">
                    Parece que algo deu errado no portal... Tente novamente!
                </p>
            </div>
        `;
    }
}
