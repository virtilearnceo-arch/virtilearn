/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckoutClient from "./checkoutClient";
import { getUser } from "@/lib/supabase/getUser";

export default async function CheckoutPage(props: any) {
    const params = await props.params; // ✅ Must await in Next 15+
    const courseId = params?.id;


    const user = await getUser();

    return <CheckoutClient courseId={courseId} userId={user?.id ?? null} />;
}
