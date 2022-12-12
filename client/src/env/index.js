console.log(process.env);
console.log(process.env.ENV);

const getEnv = () => {
  return process.env.NODE_ENV === 'development' ? 'development' : 'production';
}

export default getEnv();