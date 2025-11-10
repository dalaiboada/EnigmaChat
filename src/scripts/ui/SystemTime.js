const systemTimeElement = document.getElementById('system-time');

const updateSystemTime = () => {
  const now = new Date();
  
  const hour = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  systemTimeElement.textContent = `${hour}:${minutes}:${seconds}`;
}

export default updateSystemTime;