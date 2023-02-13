#### Conventional commits

Коммиты делаем малыми шагами, используя Conventional Commits.
Язык для комментариев En или Ru.
Следуем данному шаблону:

> \<type>[optional scope]: \<description>
 [optional body]
 [optional footer(s)]
#### type

Для автоматизированной обработки важно чтобы типы были стандартизированы, их можно расширять, но базовый набор содержит следующие: feat:, fix:, build:, chore:, ci:, docs:, style:, refactor:, perf:, test:;

#### description 

Хочу особо подчеркнуть одно важное правило: хорошее примечание к коммиту должно заканчивать следующее предложение: 
«После применения данного коммита будет {{ текст вашего примечания }}». Например:

> После применения данного коммита будет *Обновлен файл readme*
После применения данного коммита будет *Добавлена валидация вызова GET /user/:id API*
После применения данного коммита будет *Отменен коммит 12345*

Или

«If applied, this commit will {{ your subject line here }}»

Например:

>If applied, this commit will *Refactor subsystem X for readability*
If applied, this commit will *Update getting started documentation*
If applied, this commit will *Remove deprecated methods*
If applied, this commit will *Release version 1.0.0*
If applied, this commit will *Merge pull request #123 from user/branch*

Примеры коммитов:
> *Move json module to modules* - «If applied, this commit will Move json module to modules»
> 
> *Add errors to swagger* - «If applied, this commit will Add errors to swagger»
> 
> *Добавлена обработка ошибок* - «После применения данного коммита будет Добавлена обработка ошибок»
> 
> *Добавлен сервис для конвертации md в pdf* - «После применения данного коммита будет Добавлен сервис для конвертации md в pdf»

#### Ветвление

Что касается ветвления, придерживаемся подхода GitHub Flow. Прочитать можно на [SOER Media](https://s0er.ru/documents/workbook/3185) и [habr](https://habr.com/ru/post/346066/).

Названия для веток даем по шаблону:

> refactor/[что затронули]/[номер задачи]
> 
> test/[auth-service]/#108
> refactor/[auth-controller]/#109
  
####Политика слияния [Semi-linear merge](https://devblogs.microsoft.com/devops/pull-requests-with-rebase/)

![semi linear](https://devblogs.microsoft.com/devops/wp-content/uploads/sites/6/2019/04/semilinear-1.gif)

Эта стратегия представляет собой смесь rebase и merge. Сначала коммиты в PR ребейзятся поверх основной ветки. Затем происходит слияние с основной веткой с созданием мерж реквеста. Это эмулирует выполнение git rebase master на ветке pull request, а затем git merge pr --no-ff на ветке master.
Сочетает в себе лучшие из двух миров: отдельные коммиты сохраняются, чтобы мы могли видеть, как равивалась работа, но вместо простого ребейза у нас создается мерж коммит, чтобы мы могли увидеть начало и конец работы в каждом PR.

##### Полезные ссылки:
[SOER Media](https://s0er.ru/documents/workbook/3185)
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
[How to Write a Git Commit Message](https://cbea.ms/git-commit/)
[Pull Requests with Rebase](https://devblogs.microsoft.com/devops/pull-requests-with-rebase/)
