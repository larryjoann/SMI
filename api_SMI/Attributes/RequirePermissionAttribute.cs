using System;

namespace api_SMI.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class RequirePermissionAttribute : Attribute
    {
        public string[] Permissions { get; }

        public RequirePermissionAttribute(params string[] permissions)
        {
            Permissions = permissions ?? Array.Empty<string>();
        }
    }
}