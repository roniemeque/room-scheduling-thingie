const NOME_KEY = "p9_sala_reuniao_nome";

export const getOwnerLocalstorage = () => localStorage.getItem(NOME_KEY) || "";

export const setOwnerLocalstorage = nome =>
  localStorage.setItem(NOME_KEY, nome);
