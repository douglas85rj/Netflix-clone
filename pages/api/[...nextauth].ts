import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import prismadb from '../../lib/prismadb';
import { compare } from 'bcrypt'

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
        }
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
            throw new Error ('Email não existe');
        }
        const isCorrectPassword = await compare(
credencials.password,
user.hashedPassword

        );
if(!isCorrectPassword) {
  throw new Error('Senha incorreta');
}
 return user;
      }
    })
  ],
  pages:{
    signIn: '/auth',
  },
  debug:process.env.NODE_ENV === 'development',
  session:{
    strategy:"jwt",
    },
    jwt:{
      secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
})
