using System;
using System.IO;
using System.Reflection;
class InspectGh {
  static void Main(string[] args) {
    var assembly=Assembly.LoadFrom(args[0]);
    Console.WriteLine(assembly.FullName);
    var type=assembly.GetType("GH_IO.Serialization.GH_Archive");
    if(args.Length==1) {foreach(var method in type.GetMethods())Console.WriteLine(method);return;}
    var archive=Activator.CreateInstance(type);
    Console.WriteLine(type.GetMethod("ReadFromFile").Invoke(archive,new object[]{args[1]}));
    var xml=(string)type.GetMethod("Serialize_Xml",Type.EmptyTypes).Invoke(archive,null);
    File.WriteAllText(args[2],xml);
  }
}
