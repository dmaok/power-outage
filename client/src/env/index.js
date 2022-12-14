const getEnv = () => {
  return process.env.NODE_ENV === 'development' ? 'development' : 'production';
}

export default getEnv();