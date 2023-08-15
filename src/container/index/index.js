export class Todo {
    // реалізація зберігання та відображення нашого списку
    static #NAME = 'todo'

    static #saveData = () => {
        localStorage.setItem (
            this.#NAME,
            JSON.stringify({
                list: this.#list,
                count: this.#count,
            }),
        )
    }

    static #loadData = () => {
        const data = localStorage.getItem(this.#NAME)

        if (data) {
            const { list, count} = JSON.parse(data)
            this.#list = list
            this.#count = count
        }
    }
    static #list =[]
    static #count = 0    // для сберігання історії номерів, індівідуальні

    static #createTaskData = (text) => {
        this.#list.push ({
            id: ++this.#count,
            text,
            done: false,
        })
    }
    // посилання для елемента задача
    static #block = null
    // посил на темплейт для зручності звертання
    static #template = null
    // поле вводу
    static #input = null
    // кнопка додати
    static #button = null
    //головний для створення сторінки через темплейт. З ним можна взаємодіяти лтше через код
    static init = () => {
        this.#template = 
        document.getElementById(
            'task',
            ).content.firstElementChild

        this.#block = document.querySelector('.task__list')

        this.#input = document.querySelector('.form__input')

        this.#button = document.querySelector('.form__button')   
        // онклик підключимо виконання "додати"
        this.#button.onclick = this.#handleAdd

        this.#loadData()

        this.#render()

    }
// контроль дії, нової задачи. Звертатись до значеня з інпут і передати в створеня строки123
    static #handleAdd = () => {
        const value = this.#input.value
        if (value.length > 1) {
// тільки при наявності в інпуті хочя б 1 символу можна створити нову задачу
            this.#createTaskData(value)
            this.#input.value = ''
            this.#render()
            this.#saveData()
        }
      }
        
// для рендера списку на єкран. Копіі темплейта
        static #render = () => {
           this.#block.innerHTML = ''  // кожен раз починаємо з пустого поля, щоб не дублювати попередній запис
// перевірка чи список пустий
           if (this.#list.length === 0) {
                 this.#block.innerText = `Список задач пустий`
           } else {
               this.#list.forEach((taskData) => {
                   const el = this.#createTaskElem(taskData)
                   this.#block.append (el)   //    додаємо в середину блока нов рядок списку
                })
            }
         }


        static #createTaskElem = (data) => {
            const el = this.#template.cloneNode(true) 
            //    обовїязково .cloneNode(true), щоб глибинно клонувати зміст тегу
            // через деструктур витягуэмо те, що треба
            const [id, text, btnDo, btnCancel] = el.children
            id.innerText = `${data.id}.`

            text.innerText = data.text

            btnCancel.onclick = this.#handleCancel(data)

            btnDo.onclick = this.#handleDo(data, btnDo, el)

            if (data.done) {
                el.classList.add('task--done')
                btnDo.classList.remove('task__button--do')
                btnDo.classList.add('task__button--done')
            }

            return el 
        }
    // Реалізація кнопок зроблено, та видалити через замикання. Приймає дата: удалить→обновить
            static #handleDo = (data, btn, el) => ()=> {
              const result = this.#toggleDone(data.id)
            //   тут або true or false? і якщо в результ прийдет 0 из static #toggleDone, код не виконається
              if (result === true || result === false) {
                el.classList.toggle('task--done')
                // якщо одна з двох умов виконано - то при натисканні перемикаемо кнопки через класс
                btn.classList.toggle('task__button--do')
                btn.classList.toggle('task__button--done')

                this.#saveData()
              }
            }
            static #toggleDone = (id) => {
                const task = this.#list.find((item) => item.id === id)
// переключаем значение на противоположное toggleDone
                if (task) {
                    task.done = !task.done
                    return task.done
                } else {
                    return null
                }
            }
               
        // Реалізація кнопок вдаленняроблено, та видалити через замикання. Приймає дата: удалить→обновить
        static #handleCancel = (data) => ()=> {
            // модальне вікно для підтвердження дії
            if (confirm('Видалити задачу?')) {
                const result = this.#deleteById(data.id)
            if (result) {
                 this.#render()
                 this.#saveData()
                }
            }
            
        }
// видалення по id, повертає true, робимо рендер. якщо False - без рендера
        static #deleteById = (id) => {
            this.#list = this.#list.filter((item) => item.id !==id)
            return true

        }
    }

Todo.init()

window.todo = Todo