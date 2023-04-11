import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import prismadb from '../../lib/prismadb';


export default NextAuth({
  providers: [
    Credentials({
      id: "credencials",
      name: "Credencials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credencials) {
        if (!credencials?.email || !credencials?.password) {
          throw new Error("Email e senha necessários");
        }

        const user = await prismadb.user.findUnique({
            where:{
                email:credencials.email
            }
        });
        if (!user || !user.hashedPassword) {
            throw new Error ('Email não existe')
        }
      },
    }),
  ],
});
