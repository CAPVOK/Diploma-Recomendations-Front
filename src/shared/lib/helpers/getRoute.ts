import { RoutesEnum } from "../consts";

export const getRoute = (pathTemplate: RoutesEnum, ...args: (string | number)[]) => {
  const paramsArray = pathTemplate.match(/:[^/]+/g)?.map(param => param.slice(1)) || [];

  let resultPath = pathTemplate.toString();
  args.forEach((arg, i) => {
    resultPath = resultPath.replace(`:${paramsArray[i]}`, String(arg));
  });
  return resultPath;
};
