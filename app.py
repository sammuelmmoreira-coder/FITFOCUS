import streamlit as st
import google.generativeai as genai

# Configuração visual simples
st.set_page_config(page_title="FitFocus AI", page_icon="🏋️‍♂️")
st.title("🏋️‍♂️ FitFocus AI Trainer")

# Pega a sua chave de forma segura
if "GOOGLE_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
else:
    st.error("Chave API não configurada!")

prompt_usuario = st.text_input("Qual o seu objetivo de hoje?")

if st.button("Gerar Treino"):
    model = genai.GenerativeModel('gemini-1.5-flash')
    # Aqui ele usa as instruções que você criou
    response = model.generate_content(f"Aja como um treinador FitFocus: {prompt_usuario}")
    st.write(response.text)
