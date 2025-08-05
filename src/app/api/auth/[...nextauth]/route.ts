import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { connectDB } from "@/utils/connectDB";
import { User } from "@/models/user";
import { verifyPassword } from "@/lib/bcrypt";
import { loginSchema } from "@/lib/zodShemas";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        
        // Validate credentials with zod schema
        const parsedCredentials = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
        
        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials");
        }

        if (!credentials || !credentials.email) {
          throw new Error("Credentials are missing");
        }
        
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password as string
        );
        
        if (!isValid) {
          throw new Error("Invalid password or email");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();
      
      if (account && account.provider === "google") {
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            password: "",
            role: "user",
          });
        }
        user.role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
