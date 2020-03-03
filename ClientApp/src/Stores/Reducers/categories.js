import { PURGE } from "redux-persist";
const SET_CATEGORIES = 'categories/SET_CATEGORIES';
const SET_TODOS = 'categories/SET_TODOS';
const SET_SELECTED_CATEGORY = 'categories/SET_SELECTED_CATEGORY';
// set todo after add/edit/delete and subscribe them in category, todo

export const setCategories = (categories) => ({ 
  type: SET_CATEGORIES,
    payload:{
      categories : categories
    }
});

export const setSelectedCategory = (selectedCategory) =>({
  type: SET_SELECTED_CATEGORY,
    payload:{
      selectedCategory : selectedCategory
    }
})

export const setTodos = (todos, categoryId) => ({
  type: SET_TODOS,
    payload:{
      todos : todos,
      categoryId : categoryId
    }
})

const initialState = {
  categories : [],
  selectedCategory : 0
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SET_CATEGORIES:
        const {categories} = action.payload
        return {
          ...state,
          categories:categories
        };
      case SET_SELECTED_CATEGORY:
        const {selectedCategory} = action.payload
      return {
        ...state,
        selectedCategory : selectedCategory
      };
      case SET_TODOS:
        const {todos, categoryId} = action.payload
        const index = state.categories.findIndex(c=>c.id === categoryId)
        var list = state.categories
        list[index].todos = todos
        return {
          ...state,
          categories : list
        };
      case PURGE:
        return initialState
      default:
        return state;
    }
  }
  