export const getToken = (tokenName) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${tokenName}=`))
    ?.split('=')[1];
  return token;
}