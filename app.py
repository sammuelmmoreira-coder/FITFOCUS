import streamlit as st
import google.generativeai as genai

# Configuração da página
st.set_page_config(page_title="FitFocus AI", page_icon="🏋️‍♂️")
st.title("🏋️‍♂️ FitFocus AI Trainer")

# Pega a chave dos Secrets (aquela que você salvou no Streamlit)
if "GOOGLE_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
else:
    st.error("Erro: Você esqueceu de colocar a chave nos 'Secrets' do Streamlit!")
    st.stop()

# Caixa de texto para o usuário
objetivo = st.text_input("O que vamos treinar hoje?", placeholder="Ex: Treino de pernas e glúteos")

if st.button("Gerar Plano de Treino"):
    if objetivo:
        with st.spinner('Montando seu treino...'):
            try:
                # Mudança crucial: usando o nome "gemini-1.5-flash-latest"
                model = genai.GenerativeModel('gemini-1.5-flash-latest')
                
                # O comando que vai para a IA
                resposta = model.generate_content(f"Aja como um treinador FitFocus e crie um treino para: {objetivo}")
                
                st.markdown("---")
                st.write(resposta.text)
            except Exception as e:
                # Se der erro, ele vai te dizer exatamente o que é
                st.error(f"Erro na conexão: {e}")
    else:
        st.warning("Por favor, digite seu objetivo primeiro.")
