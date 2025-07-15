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
        resultado.innerHTML = '<p style="color: #e74c3c;">⚠️ Por favor, digite o nome de um personagem!</p>';
        return;
    }
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border: 2px solid #667eea; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p>Buscando personagem...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    try {
        const personagem = await buscarPersonagem(nome)
        if (personagem) {
            const imageUrl = personagem.image;
            console.log("", imageUrl)

            let imagemHtml = '';

            if (imageUrl) {
                imagemHtml = `
                <img id="img-${personagem.id} || 'default'}"
                    src="${imageUrl}"
                    alt="personagem"
                    width="200"
                    style="border-radius: 8px; display: block;" 
                        onload="document.getElementById('placeholder-${personagem.id || 'default'}').style.display='none';"
                        onerror="this.style.display='none'; document.getElementById('placeholder-${personagem.id || 'default'}').style.display='flex';"
                `
            }
            resultado.innerHTML = `
            <h2>${personagem.name}</h2> 
            ${imagemHtml}
            <p><strong>Status:</strong> ${personagem.status || 'Desconhecida'}</p>
            <p><strong>Gênero:</strong> ${personagem.gender || 'Desconhecido'}</p>
        `;
        } else {
            resultado.innerHTML = '<p style="color: #e74c3c;">❌ Personagem não encontrado! Tente outro nome.</p>';
        }
    } catch(e) {
        resultado.innerHTML = `<p style="color: #e74c3c;">💥 Erro na busca: ${e.message}</p>`;
    }
}
buscarPersonagem('Rick Sanchez')
buscarPersonagem('Morty Smith')