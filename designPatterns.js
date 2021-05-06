 // 耦合
 内容耦合：一个模块直接访问另一模块的内容
 公共耦合：一组模块都访问同一个全局数据结构
 外部耦合：一组模块都访问同一全局简单变量，而且不通过参数表传递该全局变量的信息
 控制耦合：模块之间传递的不是数据信息，而是控制信息例如标志、开关量等，一个模块控制了另一个模块的功能
 标记耦合：调用模块和被调用模块之间传递数据结构而不是简单数据
 数据耦合：调用模块和被调用模块之间只传递简单的数据项参数
 非直接耦合：两个模块之间没有直接关系，它们之间的联系完全通过主模块调度

 // 内聚
 偶然内聚
 逻辑内聚
 时间内聚
 通信内聚
 顺序内聚
 功能内聚


 // 非多态
 var makeSound = function(animal) {
   if(animal instanceof Duck) {
     console.log('嘎嘎嘎');
   } else if (animal instanceof Chicken) {
     console.log('咯咯咯');
   }
 }

 var Duck = function(){}
 var Chiken = function() {};

 makeSound(new Chicken());
 makeSound(new Duck());

 // 多态
 var makeSound = function(animal) {
   animal.sound();
 }

 var Duck = function(){}
 Duck.prototype.sound = function() {
   console.log('嘎嘎嘎')
 }
 var Chiken = function() {};
 Chiken.prototype.sound = function() {
   console.log('咯咯咯')
 }

 makeSound(new Chicken());
 makeSound(new Duck());