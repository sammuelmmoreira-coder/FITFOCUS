import streamlit as st
import google.generativeai as genai

st.set_page_config(page_title="FitFocus AI", page_icon="🏋️‍♂️")
st.title("🏋️‍♂️ FitFocus AI Trainer")

# Tenta carregar a chave secreta
if "GOOGLE_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
else:
    st.error("Chave API não encontrada nos Secrets!")
    st.stop()

# Nome do modelo (vamos tentar o nome padrão sem o prefixo desta vez)
MODEL_NAME = 'gemini-1.5-flash'

prompt_usuario = st.text_input("Qual o seu objetivo de hoje?", placeholder="Ex: Treino de pernas para iniciante")

if st.button("Gerar Treino"):
    if not prompt_usuario:
        st.warning("Por favor, digite seu objetivo.")
    else:
        with st.spinner('Criando seu treino personalizado...'):
            try:
                # Inicializa o modelo
                model = genai.GenerativeModel(MODEL_NAME)
                # Gera o conteúdo
                response = model.generate_content(f"Aja como um treinador FitFocus especialista: {prompt_usuario}")
                st.markdown("### Seu Treino:")
                st.write(response.text)
            except Exception as e:
                st.error(f"Erro ao falar com a IA: {e}")
                st.info("Dica: Verifique se sua API Key está correta e se o modelo 'gemini-1.5-flash' está disponível na sua região.")
