// 비디오 태그 가져오기
const videoElement = document.getElementById('webcam');

// 웹캠 스트림을 가져와 비디오 태그에 연결
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error accessing webcam: ', error);
  }
}

// 수량이 변경될 때 AJAX 요청을 보냄
function updateQuantity(itemId, newQuantity) {
  fetch('/update_quantity/' + itemId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity: newQuantity })  // 잘못된 부분은 여기일 가능성이 큼
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('수량이 업데이트되었습니다.');
      // 수량이 변경되면 페이지를 다시 로드하거나, 총 가격을 업데이트하는 로직을 추가할 수 있습니다.
      window.location.reload(); // 수정 후 페이지 새로고침
    } else {
      console.error('수량 업데이트에 실패했습니다.');
    }
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
}


// 웹캠 시작
startWebcam();
