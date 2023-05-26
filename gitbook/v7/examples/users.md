# users

```javascript
try {
  const hash = "invitation-hash";

  const invitationsSchema = await exh.data.schemas.findByName("INVITATIONS");
  const { id = "", email = "" } = getCurrentUser();

  const rql = rqlBuilder().eq("data.code", hash).build();

  const {
    data,
    id: invitationId,
    status,
  } = (await exh.data.documents.findFirst) <
  InvitationData >
  (invitationsSchema.id, { rql });

  const { groupId, email: inviteEmail, userId } = data;

  if (userId !== id || email !== inviteEmail) {
    return reject({
      errorMessage: "wrong user is logged in",
    });
  }

  //if status is mail-invitation then the invite got made before the user activated his account and got a userId, so we have to manually push it to pending and then accept
  if (status == "mail-invitation") {
    const { affectedRecords: affectedPending } =
      await exh.data.documents.transition(invitationsSchema.id, invitationId, {
        id: invitationsSchema.findTransitionIdByName("to_pending"),
      });

    if (affectedPending == 1) {
      const { affectedRecords } = await exh.data.documents.transition(
        invitationsSchema.id,
        invitationId,
        { id: invitationsSchema.findTransitionIdByName("accept") }
      );
      if (affectedRecords === 1) {
        return {
          ...getCurrentUser(),
          currentOrganisation: { id: groupId },
        };
      }
    }
  } else if (status == "pending") {
    //if status is pending we can just accept it
    const { affectedRecords } = await exh.data.documents.transition(
      invitationsSchema.id,
      invitationId,
      { id: invitationsSchema.findTransitionIdByName("accept") }
    );

    if (affectedRecords === 1) {
      return {
        ...getCurrentUser(),
        currentOrganisation: { id: groupId },
      };
    }
  } else if (status == "used") {
    return {
      ...getCurrentUser(),
      currentOrganisation: { id: groupId },
    };
  }

  return { ...getCurrentUser() };
} catch (error) {
  // handle error
}
```
