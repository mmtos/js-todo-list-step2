import TodoList from './TodoList.js';
import UserTitle from './UserTitle.js';
import UserList from './UserList.js';
import TodoInput from './TodoInput.js';
import api from './util/api.js';
import TodoCount from './TodoCount.js';
import UserRegister from './UserRegister.js';
import { MESSAGE } from './util/constants.js';

export default class App {
  constructor({
    username,
    userArray,
    $targetUserTitle,
    $targetUserList,
    $targetUserRegister,
    $targetTodoInput,
    $targetTodoList,
    $targetTodoCountContainer,
  }) {
    this.username = username;
    this.userArray = userArray;
    this.$targetUserTitle = $targetUserTitle;
    this.$targetUserList = $targetUserList;
    this.$targetUserRegister = $targetUserRegister;
    this.$targetTodoInput = $targetTodoInput;
    this.$targetTodoList = $targetTodoList;
    this.$targetTodoCountContainer = $targetTodoCountContainer;

    this.userTitle = new UserTitle({
      username,
      $targetUserTitle
    });

    this.userRegister = new UserRegister({
      username,
      $targetUserRegister,
      onClickRegister: async (newUsername) => {
        await api.fetchTodoPost(newUsername, MESSAGE.TEMP);
        const response = await api.fetchUserTodo(newUsername);
        const data = response.todoList;
        await api.fetchTodoRemove(newUsername, data[data.length - 1]._id);
        this.setState(newUsername);
      },
    });

    this.userList = new UserList({
      username,
      userArray,
      $targetUserList,
      onClickUser: (selectedUsername) => {
        this.userTitle.setState(selectedUsername)
        this.setState(selectedUsername);
      },
    });

    this.todoInput = new TodoInput({
      $targetTodoInput,
      $targetUserList,
      onInput: async (text) => {
        await api.fetchTodoPost(this.username, text);
        this.setState(this.username);
      },
    });

    this.todoList = new TodoList({
      username,
      $targetTodoList,
      onToggle: async (id) => {
        await api.fetchTodoToggle(this.username, id);
        this.setState(this.username);
      },
      onRemove: async (id) => {
        await api.fetchTodoRemove(this.username, id);
        this.setState(this.username);
      },
      onEdit: async (id, text) => {
        await api.fetchTodoUpdate(this.username, id, text);
        this.setState(this.username);
      },
    });

    this.todoCount = new TodoCount({
      username,
      $targetTodoCountContainer,
    });
  }

  setState(selectedUsername) {
    this.username = selectedUsername;
    this.userList.setState(this.username);
    this.todoList.setState(this.username);
    this.todoCount.setState(this.username);
  }
}
