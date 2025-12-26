import streamlit as st
import google.generativeai as genai

# Título do seu App
st.title("🏋️‍♂️ FitFocus AI Trainer")

# 1. Tenta pegar a chave que você salvou no Passo 1
if "GOOGLE_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
else:
    st.error("Faltou configurar a chave no Streamlit (Passo 1)!")
    st.stop()

# 2. Campo para você digitar
pergunta = st.text_input("Qual o seu objetivo de treino hoje?")

# 3. Botão para gerar
if st.button("Gerar Treino"):
    if pergunta:
        try:
            # Usando o nome direto do modelo para evitar o erro 404
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(pergunta)
            
            st.markdown("---")
            st.write(response.text)
        except Exception as e:
            st.error(f"Erro do Google: {e}")
    else:
        st.warning("Escreva algo primeiro!")
