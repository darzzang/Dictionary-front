const query = document.getElementById('search') // 검색한 값 가져오기
        const submitBtn = document.getElementById('submit')
        const BASE_URL = 'http://localhost:5000/api/words'

        // 검색어에 특수문자가 들어간 경우 검색이 안되도록 함
        function checkIfStringHasSpecialCharacter(str) {    
            const re = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;
            return re.test(str);
        }
        // 검색어에 숫자가 들어간 경우 검색이 안되도록 함
        function checkIfStringHasNumbers(str) { 
            return /\d/.test(str);
        }
        // 영어가 포함된 경우 검색이 안되도록 함
        function checkStringHasLetters(str){
            return /[a-z]/i.test(str);   // i는 대문자 소문자 다 
        }
        // 버튼 활성화
        function enableSubmitBtn(state){
            submitBtn.disabled = state
        }

        // 서버 데이터 가져오기
        function getData(baseUrl, query){  
            // 버튼 비활성화
            enableSubmitBtn(true)

            console.log("서버 접속중..") 
            // 사용자 입력 유효성 검증
            if (checkIfStringHasSpecialCharacter(query)) {  // 검색한 쿼리가 이 조건에 포함하는지 확인
                enableSubmitBtn(false)  // 활성화
                container.innerHTML = "특수문자는 검색할 수 없습니다."
                return;
            } 
            if (checkIfStringHasNumbers(query)){
                enableSubmitBtn(false)  // 활성화  
                container.innerHTML = "숫자는 검색할 수 없습니다."
                return;
            }
            if (checkStringHasLetters(query)){
                enableSubmitBtn(false)  // 활성화
                container.innerHTML = "영어는 검색할 수 없습니다."
                return;
            }

            fetch(`${baseUrl}/${query}`, {  // 비동기 메서드-콜백함수 필요
                headers: {
                    "Content-Type": "application/json"
                }
            }) 
            .then( res => res.json())
            .then( data => {
                enableSubmitBtn(false)  // 활성화

                console.log(data)
                const {words} = data;

                //데이터 유효성 검증
                if(words.length === 0){
                    container.innerHTML = "검색 결과를 찾을 수 없습니다." 
                    return;
                }

                const template = words.map(word => {
                    return (
                        // 템플릿
                        `
                            <div class="item">
                                <div class = "word">
                                    <a href =${word.r_link} target="_blank">
                                        ${word.r_word}
                                        <sup>${word.r_seq? word.r_seq: ""}</sup>
                                    </a>
                                    ${word.r_chi} ${word.r_pos}  
                                </div>
                                <p>
                                    ${word.r_des} 
                                    <a href=${word.r_link} class="btn_allmost" style="white-space:nowrap;">자세히 보기</a>
                                    </p>
                            </div>
                        `
                    )
                })
                container.innerHTML = template.join("") // DOM 에 템플릿 삽입
            })
        }

        submitBtn.addEventListener('click', function(){ // 클릭 이벤트
            console.log(query.value)    // 사용자가 입력한 값 개발자도구 콘솔창에 나타내기

            getData(BASE_URL, query.value)
        })

        query.addEventListener('keypress', function(e) {
            if(e.keyCode ===13) {
                getData(BASE_URL, query.value)
            }
        })

        window.addEventListener('DOMContentLoaded', function(){ //브라우저에서 URL을 로드
            setTimeout(getData(BASE_URL, query.value), 5000)  // 5초
        })