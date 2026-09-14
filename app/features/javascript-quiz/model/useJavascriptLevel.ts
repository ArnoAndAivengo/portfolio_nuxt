import { JS_LEVELS, type JavascriptLevelId } from './levels'

export const useJavascriptLevel = () =>
  useState<JavascriptLevelId>('javascript-quiz-level', () => 'basic')

export const javascriptLevelMeta = (id: JavascriptLevelId) =>
  JS_LEVELS.find((item) => item.id === id) ?? JS_LEVELS[0]
