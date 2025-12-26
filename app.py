import streamlit as st
import google.generativeai as genai

st.set_page_config(page_title="FitFocus AI", page_icon="🏋️‍♂️")
st.title("🏋️‍♂️ FitFocus AI Trainer")

# Configuração da Chave
if "GOOGLE_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
else:
    st.error("Configure a GOOGLE_API_KEY nos Secrets do Streamlit.")
    st.stop()

# Entrada do usuário
objetivo = st.text_input("Qual o seu objetivo de hoje?", placeholder="Ex: Treino de glúteos e pernas")

if st.button("Gerar Treino"):
    if objetivo:
        with st.spinner('Consultando o treinador...'):
            try:
                # Mudamos para o nome simples do modelo
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                # O prompt que envia o seu comando
                response = model.generate_content(f"Aja como um treinador FitFocus especialista e gere: {objetivo}")
                
                st.markdown("---")
                st.markdown(response.text)
            except Exception as e:
                st.error(f"Ops! Algo deu errado: {e}")
    else:
        st.warning("Por favor, digite seu objetivo primeiro.")
