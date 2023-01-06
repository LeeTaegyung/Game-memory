(() => {
    const wrap = document.getElementById('wrap');
    const stage = document.querySelector('.stage');
    const cardList = document.querySelectorAll('.card');
    const startBtn = document.querySelector('.game_start');
    const life = document.querySelector('.life');
    const heart = life.querySelectorAll('span');
    const state = {
        myTurn: false,
        isStart: false,
    }
    let followArr = [];
    let countNum = 5;
    let level = 1;

    function createCount(num) {
        const countEl = document.createElement('span');
        countEl.classList.add('count');
        countEl.innerHTML = countNum;
        wrap.appendChild(countEl);

        setTimeout(function() {
            countEl.remove();
        }, 1000);
    }

    function startCount() {
        return new Promise((resolve) => {
            let countControl = setInterval(function(){
                countNum--;

                if(countNum == 1) {
                    clearInterval(countControl);
                    setTimeout(function(){
                        resolve();
                    }, 1000);
                }

                createCount(countNum);

            }, 1000)
        })
    }

    function gameStart() {
        return new Promise((resolve) => {

            followArr = [];

            // 랜덤 숫자 뽑기
            for(let i = 0; i < level + 1; i++) {
                followArr.push(Math.floor(Math.random() * (cardList.length - 1)));
            }

            // 클래스 추가하고 0.3초 후에 클래스 삭제
            let i = 0;
            let followCardAni = setInterval(function(){
                const followIdx = followArr[i];
                cardList[followIdx].classList.add('active');
                
                setTimeout(function(){
                    cardList[followIdx].classList.remove('active');
                }, 400);

                i++;
                
                if(i == followArr.length) {
                    clearInterval(followCardAni);
                    resolve();
                }

            }, 500);
        }).then(() => {
            state.myTurn = true;
        })
    }


    startBtn.addEventListener('click', function(){
        if(state.isStart) return;
        state.isStart = true;

        // 처음 카운트 5 표시
        createCount(countNum);

        // 나머지 카운트 끝나면, 게임 시작
        startCount().then(gameStart);

    })

    stage.addEventListener('click', function(e){
        
        if(!state.myTurn) return;

        const target = e.target.closest('.card');
        const die = life.querySelectorAll('.die');
        const span = document.createElement('span');
        
        if(!target) return;
        
        const clickIdx = Array.from(cardList).findIndex(ele => ele === target);
        const x = e.pageX - target.getBoundingClientRect().left;
        const y = e.pageY - target.getBoundingClientRect().top;

        span.style.top = y + 'px';
        span.style.left = x + 'px';
        
        // 무조건 첫번째랑 비교,
        if(followArr[0] === clickIdx) { // 값이 같으면
            followArr.splice(0, 1); // 첫번째값 삭제
        } else { // 값이 틀리면
            state.myTurn = false;
            heart[die.length].classList.add('die');

            if(die.length === heart.length - 1) { // 하트 다 소진
                // gameEnd();
                state.isStart = false;
            } else {
                // 지금 레벨의 처음부터
                setTimeout(function(){
                    gameStart();
                }, 500)
                // 여기에 틀렸을때 애니메이션 추가?
            }

        }

        // 비교할 값이 더이상 없으면,
        if(followArr[0] === undefined) {
            state.myTurn = false;
            level++;
            setTimeout(function(){
                gameStart();
            }, 500)
        }

        target.appendChild(span);

        setTimeout(function(){
            span.remove();
        }, 500)

    })


})()