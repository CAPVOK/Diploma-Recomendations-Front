import { UserRoleEnum } from "@/entities/user";
import { useAppSelector } from "@/shared/config/store";

type TPermissions = {
  /*  course: {
    canEnroll: boolean;
    canManage: boolean;
  };
  question: {};
  test: {}; */
  isStudent: boolean;
  isTeacher: boolean;
};

/**
 * Хук возвращает разрешения на действия в зависимости от роли пользователя
 */
export const usePermissions = (): TPermissions => {
  const role = useAppSelector((state) => state.auth.user?.role);
  switch (role) {
    case UserRoleEnum.Teacher:
      return {
        /*  course: {
          canEnroll: false,
          canManage: true,
        },
        question: {},
        test: {}, */
        isStudent: false,
        isTeacher: true,
      };
    case UserRoleEnum.Student:
      return {
        /*  course: {
          canEnroll: true,
          canManage: false,
        },
        question: {},
        test: {}, */
        isStudent: true,
        isTeacher: false,
      };
    default:
      return {
        /*  course: {
          canEnroll: false,
          canManage: false,
        },
        question: {},
        test: {}, */
        isStudent: true,
        isTeacher: false,
      };
  }
};
