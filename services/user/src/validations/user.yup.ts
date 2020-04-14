import yup from 'yup';

function getValidationSchema(info:any) {
    const mutationField = info.schema.getMutationType().getFields()[info.fieldName];
            return mutationField;
}
    const user = {
        async Mutation(resolve:any, root:any, args:any, context:any, info: any){
            const validate = getValidationSchema(info).validateSignup;
            if(validate) {
                try {
                  await getValidationSchema(info).validate(args)
                } catch (error) {
                    if(error instanceof yup.ValidationError) {
                        throw error.message
                    }else {
                        throw error
                    }
                }
            }

            return resolve(root, args, context, info);
        }
    }

export default user;